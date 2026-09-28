const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const screenshot = async (page, name) => { if (!process.env.SCREENSHOTS_DIR) return; await fs.mkdir(process.env.SCREENSHOTS_DIR, { recursive: true }); await page.evaluate(() => Promise.allSettled(document.getAnimations().map((animation) => animation.finished))); await page.screenshot({ path: path.join(process.env.SCREENSHOTS_DIR, name), fullPage: true }); };
const waitForRegion = (page, name) => page.waitForFunction((target) => document.getElementById('island-filter').value === target && document.querySelector('#map-container > svg').getAnimations().length === 0, name);
const visibleTotal = async (page) => page.locator('#map-container [tabindex="0"]').evaluateAll((nodes) => new Intl.NumberFormat('id-ID').format(nodes.reduce((sum, node) => sum + Number(node.getAttribute('aria-label').match(/, ([0-9.]+) perkara/)[1].replaceAll('.', '')), 0)));

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3011');
  await page.waitForSelector('svg [data-region]');

  const model = await page.evaluate(() => {
    const regions = window.MAP_DATA.regions;
    const groups = [...document.querySelectorAll('#map-container g[data-region]')];
    const errors = [];
    for (const region of regions) {
      const nodes = groups.filter((node) => node.dataset.region === region.id);
      if (nodes.length !== region.pieces.length) errors.push(`${region.name}: missing piece`);
      if (new Set(nodes.map((node) => node.getAttribute('fill'))).size !== 1) errors.push(`${region.name}: inconsistent colors`);
    }
    return { pieces: groups.length, provinces: regions.length, errors, total: regions.reduce((total, region) => total + Object.values(region.casesByYear).reduce((sum, count) => sum + count, 0), 0) };
  });
  assert.equal(model.pieces, 92);
  assert.equal(model.provinces, 34);
  assert.deepEqual(model.errors, []);
  assert.deepEqual(await page.locator('#map-container g[data-region]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.getAttribute('fill')))]), ['#ADC3DA']);
  assert.equal(await page.locator('#preview-mode').inputValue(), 'blue');
  await page.selectOption('#preview-mode', 'color');
  assert.deepEqual((await page.locator('#map-container g[data-region]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.getAttribute('fill')))])).sort(), ['#a71923', '#ed8031', '#ffc52b'].sort());
  assert.equal(await page.locator('#map-container [tabindex="0"]').count(), 34);
  await screenshot(page, 'color-preview.png');
  await page.selectOption('#preview-mode', 'blue');
  assert.deepEqual(await page.locator('#map-container g[data-region]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.getAttribute('fill')))]), ['#ADC3DA']);
  assert.equal(await visibleTotal(page), new Intl.NumberFormat('id-ID').format(model.total));
  assert.equal(await page.locator('#map-container [tabindex="0"]').count(), 34);
  await screenshot(page, 'desktop.png');

  // Exercise real pointer interaction on a large province path.
  await page.locator('#province_piece_049 .province-fill').click();
  await page.locator('#map-popover').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#popover-name').textContent(), 'Kalimantan Tengah');
  assert.equal(await page.locator('#popover-total').textContent(), '41');
  assert.equal(await page.locator('#popover-category').textContent(), 'Tinggi');
  await page.evaluate(() => Promise.allSettled(document.getAnimations().map((animation) => animation.finished)));
  await screenshot(page, 'detail.png');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#map-popover').isVisible(), false);

  // Keyboard access, including a small province.
  await page.locator('#province_piece_004').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#popover-name').textContent(), 'DKI Jakarta');
  assert.equal(await page.locator('#popover-total').textContent(), '68');
  await page.locator('#close-popover').click();

  // Every source piece must show its province's count, including offshore islands.
  const regions = await page.evaluate(() => window.MAP_DATA.regions.map((region) => ({ ...region, cases: Object.values(region.casesByYear).reduce((sum, count) => sum + count, 0) })));
  for (const region of regions) {
    for (const piece of region.pieces) {
      await page.locator(`#province_piece_${String(piece).padStart(3, '0')}`).dispatchEvent('click');
      assert.equal(await page.locator('#popover-name').textContent(), region.name);
      assert.equal(await page.locator('#popover-total').textContent(), new Intl.NumberFormat('id-ID').format(region.cases));
    }
  }

  await page.selectOption('#island-filter', 'Kalimantan');
  assert.equal(await visibleTotal(page), '116');
  assert.equal(await page.locator('#map-container [tabindex="0"]').count(), 5);
  await page.locator('[data-category="high"]').click();
  assert.equal(await page.locator('#province_piece_049').getAttribute('fill'), '#a71923');
  assert.equal(await page.locator('#preview-mode').inputValue(), 'color');
  await page.selectOption('#preview-mode', 'blue');
  assert.equal(await page.locator('#province_piece_049').getAttribute('fill'), '#ADC3DA');
  assert.equal(await visibleTotal(page), '41');
  await page.selectOption('#preview-mode', 'color');
  assert.equal(await page.locator('#province_piece_049').getAttribute('fill'), '#a71923');
  assert.equal(await page.locator('#province_piece_048').getAttribute('fill'), '#ADC3DA');
  assert.equal(await visibleTotal(page), '41');
  assert.equal(await page.locator('#map-container [tabindex="0"]').count(), 1);
  assert.equal(await page.locator('#map-popover').isVisible(), false);

  await page.locator('#reset').click();

  // The year filter changes counts, category membership, details together.
  assert.deepEqual(await page.locator('#year-filter option').evaluateAll((options) => options.map((option) => option.value)), ['all', '2025', '2024', '2023']);
  const yearPosition = await page.locator('#year-filter').boundingBox();
  const islandPosition = await page.locator('#island-filter').boundingBox();
  assert.ok(yearPosition.x > islandPosition.x && Math.abs(yearPosition.y - islandPosition.y) < 2);
  await page.selectOption('#year-filter', '2025');
  const annualTotal = regions.reduce((sum, region) => sum + region.casesByYear[2025], 0);
  assert.equal(await visibleTotal(page), String(annualTotal));
  assert.equal(await page.locator('#province_piece_049').getAttribute('fill'), '#ADC3DA');
  await page.locator('#province_piece_049 .province-fill').click();
  assert.equal(await page.locator('#popover-total').textContent(), '19');
  assert.equal(await page.locator('#popover-period').textContent(), 'Tahun 2025');
  assert.equal(await page.locator('#popover-category').textContent(), 'Rendah');
  await page.selectOption('#island-filter', 'Kalimantan');
  assert.equal(await visibleTotal(page), String(regions.filter((region) => region.island === 'Kalimantan').reduce((sum, region) => sum + region.casesByYear[2025], 0)));
  await page.locator('[data-category="high"]').click();
  assert.equal(await page.locator('#map-container [tabindex="0"]').count(), 0);
  await page.locator('#reset').click();
  assert.equal(await page.locator('#year-filter').inputValue(), 'all');
  assert.equal(await page.locator('#preview-mode').inputValue(), 'blue');
  assert.equal(await page.locator('#province_piece_049').getAttribute('fill'), '#ADC3DA');
  assert.equal(await visibleTotal(page), '824');

  for (const year of ['2023', '2024']) {
    await page.selectOption('#year-filter', year);
    assert.equal(await visibleTotal(page), String(regions.reduce((sum, region) => sum + region.casesByYear[year], 0)));
  }
  await page.locator('#reset').click();
  assert.equal(await page.locator('#map-container [tabindex="0"]').count(), 34);
  for (const island of ['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku', 'Papua']) {
    await page.selectOption('#island-filter', island);
    const expected = regions.filter((region) => region.island === island);
    assert.equal(await page.locator('#map-container [tabindex="0"]').count(), expected.length);
  }
  await page.locator('#reset').click();

  // Regional arrows synchronize the dropdown and keep the year/category filters.
  assert.equal(await page.locator('#previous-region').isVisible(), false);
  assert.equal(await page.locator('#next-region').isVisible(), false);
  await page.selectOption('#island-filter', 'Jawa');
  assert.equal(await page.locator('#previous-region').isVisible(), true);
  assert.equal(await page.locator('#next-region').getAttribute('aria-label'), 'Wilayah berikutnya: Kalimantan');
  await page.evaluate(() => Promise.allSettled(document.getAnimations().map((animation) => animation.finished)));
  await screenshot(page, 'region-navigation.png');
  await page.selectOption('#year-filter', '2025');
  await page.locator('[data-category="low"]').click();
  assert.equal(await page.locator('#province_piece_002').getAttribute('fill'), '#ffc52b');
  await page.locator('#province_piece_002').dispatchEvent('click');
  assert.equal(await page.locator('#map-popover').isVisible(), true);
  await page.locator('#next-region').click();
  await waitForRegion(page, 'Kalimantan');
  assert.equal(await page.locator('#island-filter').inputValue(), 'Kalimantan');
  assert.equal(await page.locator('#year-filter').inputValue(), '2025');
  assert.equal(await page.locator('[data-category="low"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#map-popover').isVisible(), false);
  const displayedIds = await page.locator('#map-container g[data-region]').evaluateAll((nodes) => [...new Set(nodes.filter((node) => getComputedStyle(node).display !== 'none').map((node) => node.dataset.region))]);
  assert.deepEqual(displayedIds.sort(), regions.filter((region) => region.island === 'Kalimantan').map((region) => region.id).sort());
  await page.locator('#next-region').click();
  await waitForRegion(page, 'Sulawesi');
  assert.equal(await page.locator('#island-filter').inputValue(), 'Sulawesi');
  await page.locator('#previous-region').click();
  await waitForRegion(page, 'Kalimantan');
  assert.equal(await page.locator('#island-filter').inputValue(), 'Kalimantan');
  await page.selectOption('#island-filter', 'Sumatera');
  await page.locator('#previous-region').click();
  await waitForRegion(page, 'Papua');
  assert.equal(await page.locator('#island-filter').inputValue(), 'Papua');
  await page.locator('#next-region').click();
  await waitForRegion(page, 'Sumatera');
  assert.equal(await page.locator('#island-filter').inputValue(), 'Sumatera');
  await page.locator('#reset').click();
  assert.equal(await page.locator('#next-region').isVisible(), false);

  // Information appears for a regional view and lists only matching records.
  assert.equal(await page.locator('#open-information').isVisible(), false);
  await page.selectOption('#island-filter', 'Sumatera');
  assert.equal(await page.locator('#open-information').isVisible(), true);
  await page.locator('#open-information').click();
  assert.equal(await page.locator('#information-dialog').isVisible(), true);
  assert.equal(await page.locator('#information-title').textContent(), 'Informasi wilayah Sumatera');
  assert.deepEqual(await page.locator('.information-table th').allTextContents(), ['Foto', 'Nama', 'Jabatan', 'Tahun']);
  assert.equal(await page.locator('#information-dialog .dialog-footer').count(), 0);
  const sumatera = regions.filter((region) => region.island === 'Sumatera');
  assert.equal(await page.locator('#information-body tr').count(), sumatera.reduce((sum, region) => sum + region.cases, 0));
  assert.equal(await page.locator('#information-body .photo-placeholder').count(), await page.locator('#information-body tr').count());
  const informationRegions = await page.locator('#information-body tr').evaluateAll((rows) => [...new Set(rows.map((row) => row.dataset.region))]);
  assert.deepEqual(informationRegions.sort(), sumatera.map((region) => region.id).sort());
  await screenshot(page, 'information-desktop.png');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#information-dialog').isVisible(), false);
  await page.waitForFunction(() => document.getElementById('open-information').getAttribute('aria-expanded') === 'false');
  assert.equal(await page.locator('#open-information').getAttribute('aria-expanded'), 'false');
  await page.selectOption('#year-filter', '2025');
  await page.locator('#open-information').click();
  assert.equal(await page.locator('#information-body tr').count(), sumatera.reduce((sum, region) => sum + region.casesByYear[2025], 0));
  assert.deepEqual(await page.locator('#information-body .information-year').evaluateAll((cells) => [...new Set(cells.map((cell) => cell.textContent))]), ['2025']);
  await page.locator('#close-information').click();
  await page.locator('[data-category="medium"]').click();
  assert.equal(await page.locator('#province_piece_072').getAttribute('fill'), '#ed8031');
  await page.locator('#open-information').click();
  assert.equal(await page.locator('#information-body tr').count(), 24);
  assert.deepEqual(await page.locator('#information-body tr').evaluateAll((rows) => [...new Set(rows.map((row) => row.dataset.region))]), ['aceh']);
  await page.locator('#close-information').click();
  await page.locator('[data-category="high"]').click();
  await page.locator('#open-information').click();
  assert.equal(await page.locator('#information-body .empty-table').isVisible(), true);
  await page.locator('#close-information').click();
  await page.locator('#reset').click();
  assert.equal(await page.locator('#open-information').isVisible(), false);

  // Mobile layout and touch, modal bounds, and popover bounds after resizing.
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3011');
  await mobile.waitForSelector('#province_piece_049');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await screenshot(mobile, 'mobile.png');
  await mobile.selectOption('#preview-mode', 'color');
  assert.equal(await mobile.locator('#province_piece_049').getAttribute('fill'), '#a71923');
  await mobile.selectOption('#preview-mode', 'blue');
  assert.equal(await mobile.locator('#province_piece_049').getAttribute('fill'), '#ADC3DA');
  await mobile.selectOption('#year-filter', '2025');
  assert.equal(await visibleTotal(mobile), String(annualTotal));
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.locator('#reset').click();
  await mobile.selectOption('#island-filter', 'Jawa');
  await mobile.selectOption('#year-filter', '2025');
  await mobile.locator('#next-region').tap();
  await waitForRegion(mobile, 'Kalimantan');
  assert.equal(await mobile.locator('#island-filter').inputValue(), 'Kalimantan');
  await mobile.locator('#open-information').tap();
  assert.equal(await mobile.locator('#information-title').textContent(), 'Informasi wilayah Kalimantan');
  assert.equal(await mobile.locator('#information-body tr').count(), 56);
  assert.equal(await mobile.evaluate(() => {
    const dialog = document.getElementById('information-dialog');
    return dialog.scrollWidth <= dialog.clientWidth && dialog.getBoundingClientRect().right <= innerWidth;
  }), true);
  await screenshot(mobile, 'information-mobile.png');
  await mobile.locator('#close-information').tap();
  assert.equal(await mobile.locator('#information-dialog').isVisible(), false);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await mobile.locator('#year-filter').inputValue(), '2025');
  await mobile.locator('#previous-region').tap();
  await waitForRegion(mobile, 'Jawa');
  assert.equal(await mobile.locator('#island-filter').inputValue(), 'Jawa');
  await mobile.evaluate(() => Promise.allSettled(document.getAnimations().map((animation) => animation.finished)));
  await screenshot(mobile, 'mobile-region-navigation.png');
  await mobile.locator('#reset').click();
  await mobile.locator('#province_piece_049 .province-fill').tap();
  assert.equal(await mobile.locator('#popover-name').textContent(), 'Kalimantan Tengah');
  const insideStage = await mobile.evaluate(() => {
    const popover = document.querySelector('#map-popover').getBoundingClientRect();
    const stage = document.querySelector('#map-stage').getBoundingClientRect();
    return popover.left >= stage.left && popover.right <= stage.right && popover.top >= stage.top && popover.bottom <= stage.bottom;
  });
  assert.equal(insideStage, true);
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.locator('#map-popover').isVisible(), false);
  await mobile.setViewportSize({ width: 320, height: 720 });
  await mobile.selectOption('#island-filter', 'Jawa');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.locator('#next-region').tap();
  await waitForRegion(mobile, 'Kalimantan');
  assert.equal(await mobile.locator('#island-filter').inputValue(), 'Kalimantan');
  await mobile.locator('#open-information').tap();
  assert.equal(await mobile.evaluate(() => {
    const dialog = document.getElementById('information-dialog');
    return dialog.scrollWidth <= dialog.clientWidth && dialog.getBoundingClientRect().right <= innerWidth;
  }), true);
  await mobile.locator('#close-information').tap();
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: regional information, placeholders, filtered records, responsive dialog, arrows, 92 SVG pieces, yearly data, detail, keyboard, and no JavaScript errors.');
})().catch((error) => { console.error(error); process.exit(1); });
