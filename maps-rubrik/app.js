(() => {
  'use strict';

  const data = window.MAP_DATA;
  const $ = (id) => document.getElementById(id);
  const format = new Intl.NumberFormat('id-ID');
  const colors = { high: '#a71923', medium: '#ed8031', low: '#ffc52b', none: '#4caf50' };
  const labels = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah', none: 'Tidak ada' };
  const dotColors = { high: 'red', medium: 'orange', low: 'yellow', none: 'green' };
  const pieceToRegion = new Map();
  const nodesByRegion = new Map();
  const islands = [...$('island-filter').options].map((option) => option.value).filter((value) => value !== 'all');
  const state = { island: 'all', year: 'all', category: 'all', preview: 'green', selected: null, hovered: null };
  let map;
  let resizeFrame;
  let regionAnimation = null;
  let navigationTarget = null;
  let navigationVersion = 0;

  const years = [...new Set(data.regions.flatMap((region) => Object.keys(region.casesByYear)))].sort((a, b) => Number(b) - Number(a));
  const casesOf = (region) => state.year === 'all' ? Object.values(region.casesByYear).reduce((sum, count) => sum + count, 0) : region.casesByYear[state.year] ?? 0;
  const periodLabel = () => state.year === 'all' ? 'Semua tahun' : `Tahun ${state.year}`;
  const categoryOf = (region) => casesOf(region) === 0 ? 'none' : casesOf(region) >= data.thresholds.high ? 'high' : casesOf(region) >= data.thresholds.medium ? 'medium' : 'low';
  const colorOf = (region) => state.preview === 'color' && (state.category === 'all' || categoryOf(region) === state.category) ? colors[categoryOf(region)] : colors.none;
  const inIsland = (region) => state.island === 'all' || region.island === state.island;
  const isVisible = (region) => inIsland(region) && (state.category === 'all' || categoryOf(region) === state.category);
  const visibleRegions = () => data.regions.filter(isVisible);

  for (const region of data.regions) {
    if (Object.values(region.casesByYear).some((count) => !Number.isInteger(count) || count < 0)) throw new Error(`Jumlah perkara tidak valid: ${region.name}`);
    for (const piece of region.pieces) {
      const id = `province_piece_${String(piece).padStart(3, '0')}`;
      if (pieceToRegion.has(id)) throw new Error(`ID wilayah dipakai dua kali: ${id}`);
      pieceToRegion.set(id, region);
    }
  }

  function categoryTag(element, region) {
    const category = categoryOf(region);
    element.className = `category-tag ${category}`;
    element.replaceChildren();
    const dot = document.createElement('i');
    dot.className = `dot ${dotColors[category]}`;
    element.append(dot, document.createTextNode(`${labels[category]}`));
  }

  function updateFilterLabels() {
    const scope = `${state.island === 'all' ? 'Seluruh wilayah Indonesia' : `Wilayah ${state.island}`} · ${periodLabel()}`;
    $('map-subtitle').textContent = `${scope}${state.category !== 'all' ? ` · Kategori ${labels[state.category].toLowerCase()}` : ''}`;
    $('preview-mode').value = state.preview;
    for (const category of Object.keys(labels)) {
      $(`count-${category}`).textContent = data.regions.filter((region) => inIsland(region) && categoryOf(region) === category).length;
    }
    for (const button of document.querySelectorAll('[data-category]')) {
      const active = button.dataset.category === state.category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    const regionalView = state.island !== 'all';
    $('open-information').hidden = !regionalView;
    document.querySelector('.toolbar-actions').classList.toggle('has-information', regionalView);
  }

  function openInformation() {
    if (state.island === 'all') return;
    cancelRegionAnimation();
    closeSelection();
    clearHover();
    const regions = new Map(visibleRegions().map((region) => [region.id, region]));
    const records = (data.information || []).filter((record) => regions.has(record.regionId) && (state.year === 'all' || Number(record.year) === Number(state.year)))
      .sort((a, b) => b.year - a.year || regions.get(a.regionId).name.localeCompare(regions.get(b.regionId).name, 'id') || a.name.localeCompare(b.name, 'id'));
    $('information-title').textContent = `Informasi wilayah ${state.island}`;
    $('information-scope').textContent = `${periodLabel()} · ${state.category === 'all' ? 'Semua kategori' : `Kategori ${labels[state.category].toLowerCase()}`}`;
    const body = $('information-body');
    body.replaceChildren();
    for (const record of records) {
      const row = document.createElement('tr');
      row.dataset.region = record.regionId;
      const photoCell = document.createElement('td');
      const photo = document.createElement('span');
      photo.className = 'photo-placeholder';
      photo.setAttribute('role', 'img');
      photo.setAttribute('aria-label', 'Foto placeholder');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      const head = document.createElementNS(svg.namespaceURI, 'circle');
      head.setAttribute('cx', '12');
      head.setAttribute('cy', '8');
      head.setAttribute('r', '4');
      const shoulders = document.createElementNS(svg.namespaceURI, 'path');
      shoulders.setAttribute('d', 'M4 22v-2a8 8 0 0 1 16 0v2Z');
      svg.append(head, shoulders);
      photo.append(svg);
      photoCell.append(photo);
      const name = document.createElement('td');
      const nameText = document.createElement('strong');
      nameText.textContent = record.name;
      const regionText = document.createElement('span');
      regionText.className = 'information-region';
      regionText.textContent = regions.get(record.regionId).name;
      name.append(nameText, regionText);
      const position = document.createElement('td');
      position.textContent = record.position;
      const year = document.createElement('td');
      year.className = 'information-year';
      year.textContent = record.year;
      row.append(photoCell, name, position, year);
      body.append(row);
    }
    if (!records.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.className = 'empty-table';
      cell.textContent = 'Belum ada informasi untuk filter yang dipilih.';
      row.append(cell);
      body.append(row);
    }
    $('open-information').setAttribute('aria-expanded', 'true');
    $('open-information').classList.add('active');
    $('information-dialog').showModal();
  }

  function updateRegionNavigation() {
    const active = Boolean(map) && state.island !== 'all';
    $('map-stage').classList.toggle('has-region-nav', active);
    $('previous-region').hidden = !active;
    $('next-region').hidden = !active;
    if (!active) return;
    const index = islands.indexOf(state.island);
    for (const [id, direction, label] of [['previous-region', -1, 'Wilayah sebelumnya'], ['next-region', 1, 'Wilayah berikutnya']]) {
      const name = islands[(index + direction + islands.length) % islands.length];
      $(id).setAttribute('aria-label', `${label}: ${name}`);
      $(id).title = `${label}: ${name}`;
    }
  }

  function cancelRegionAnimation() {
    navigationVersion++;
    regionAnimation?.cancel();
    regionAnimation = null;
    navigationTarget = null;
  }

  async function navigateRegion(direction) {
    if (!map || state.island === 'all') return;
    const index = islands.indexOf(navigationTarget ?? state.island);
    const target = islands[(index + direction + islands.length) % islands.length];
    const opacity = getComputedStyle(map).opacity;
    const version = ++navigationVersion;
    regionAnimation?.cancel();
    navigationTarget = target;
    closeSelection();
    clearHover();
    const showTarget = () => {
      state.island = target;
      $('island-filter').value = target;
      changeFilters(false);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showTarget();
      regionAnimation = null;
      navigationTarget = null;
      return;
    }
    try {
      regionAnimation = map.animate([{ opacity }, { opacity: 0 }], { duration: 120, easing: 'ease-in', fill: 'forwards' });
      await regionAnimation.finished;
      if (version !== navigationVersion) return;
      showTarget();
      regionAnimation.cancel();
      regionAnimation = map.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
      await regionAnimation.finished;
    } catch (error) {
      if (error.name !== 'AbortError') console.error('Gagal menjalankan transisi peta:', error);
    } finally {
      if (version === navigationVersion) {
        regionAnimation?.cancel();
        regionAnimation = null;
        navigationTarget = null;
      }
    }
  }

  function updateMap() {
    updateRegionNavigation();
    if (!map) return;
    clearHover();
    for (const region of data.regions) {
      const visible = isVisible(region);
      for (const [index, node] of nodesByRegion.get(region.id).entries()) {
        node.style.display = inIsland(region) ? '' : 'none';
        node.setAttribute('aria-hidden', String(!inIsland(region)));
        node.setAttribute('fill', colorOf(region));
        node.setAttribute('aria-label', `${region.name}, ${format.format(casesOf(region))} perkara, kategori ${labels[categoryOf(region)].toLowerCase()}, ${periodLabel()}, data contoh`);
        node.style.opacity = visible ? '1' : '.13';
        node.style.pointerEvents = visible ? 'auto' : 'none';
        node.setAttribute('tabindex', visible && index === 0 ? '0' : '-1');
        node.setAttribute('aria-disabled', String(!visible));
        node.classList.toggle('selected', state.selected === region.id);
        node.setAttribute('aria-pressed', String(state.selected === region.id));
      }
    }
    if (state.island === 'all') {
      map.setAttribute('viewBox', '-12 -12 1002 397');
    } else {
      const boxes = data.regions.filter(inIsland).flatMap((region) => nodesByRegion.get(region.id).map((node) => node.getBBox()));
      const left = Math.min(...boxes.map((box) => box.x));
      const top = Math.min(...boxes.map((box) => box.y));
      const right = Math.max(...boxes.map((box) => box.x + box.width));
      const bottom = Math.max(...boxes.map((box) => box.y + box.height));
      const padding = 22;
      map.setAttribute('viewBox', `${left - padding} ${top - padding} ${right - left + 2 * padding} ${bottom - top + 2 * padding}`);
    }
    positionPopover();
  }

  function clearHover() {
    if (state.hovered) for (const node of nodesByRegion.get(state.hovered) || []) node.classList.remove('hovered');
    state.hovered = null;
    $('hover-tooltip').hidden = true;
  }

  function hoverRegion(region, event) {
    clearHover();
    if (state.selected === region.id) return;
    state.hovered = region.id;
    for (const node of nodesByRegion.get(region.id)) node.classList.add('hovered');
    const tooltip = $('hover-tooltip');
    const title = document.createElement('strong');
    title.textContent = region.name;
    const description = document.createElement('span');
    description.textContent = `${format.format(casesOf(region))} perkara · ${labels[categoryOf(region)]} · ${periodLabel()}`;
    tooltip.replaceChildren(title, description);
    tooltip.hidden = false;
    positionHover(event);
  }

  function positionHover(event) {
    if ($('hover-tooltip').hidden) return;
    const stage = $('map-stage').getBoundingClientRect();
    const tooltip = $('hover-tooltip');
    const left = Math.max(8, Math.min(event.clientX - stage.left + 13, stage.width - tooltip.offsetWidth - 8));
    const top = Math.max(8, Math.min(event.clientY - stage.top - tooltip.offsetHeight - 12, stage.height - tooltip.offsetHeight - 8));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function selectRegion(region) {
    state.selected = region.id;
    clearHover();
    $('popover-name').textContent = region.name;
    $('popover-total').textContent = format.format(casesOf(region));
    $('popover-period').textContent = periodLabel();
    categoryTag($('popover-category'), region);
    $('map-popover').hidden = false;
    for (const [id, nodes] of nodesByRegion) {
      for (const node of nodes) {
        node.classList.toggle('selected', id === region.id);
        node.setAttribute('aria-pressed', String(id === region.id));
      }
    }
    positionPopover();
  }

  function positionPopover() {
    if (!map || !state.selected || $('map-popover').hidden) return;
    const nodes = nodesByRegion.get(state.selected);
    const primary = [...nodes].sort((a, b) => {
      const aa = a.getBBox();
      const bb = b.getBBox();
      return bb.width * bb.height - aa.width * aa.height;
    })[0];
    const box = primary.getBBox();
    const point = map.createSVGPoint();
    point.x = box.x + box.width / 2;
    point.y = box.y + box.height / 2;
    const screenPoint = point.matrixTransform(map.getScreenCTM());
    const stage = $('map-stage').getBoundingClientRect();
    const popover = $('map-popover');
    let left = screenPoint.x - stage.left + 20;
    if (left + popover.offsetWidth > stage.width - 10) left = screenPoint.x - stage.left - popover.offsetWidth - 20;
    popover.style.left = `${Math.max(10, Math.min(left, stage.width - popover.offsetWidth - 10))}px`;
    popover.style.top = `${Math.max(10, Math.min(screenPoint.y - stage.top - popover.offsetHeight / 2, stage.height - popover.offsetHeight - 10))}px`;
  }

  function closeSelection() {
    state.selected = null;
    $('map-popover').hidden = true;
    for (const nodes of nodesByRegion.values()) for (const node of nodes) {
      node.classList.remove('selected');
      node.setAttribute('aria-pressed', 'false');
    }
  }

  function changeFilters(cancelAnimation = true) {
    if (cancelAnimation) cancelRegionAnimation();
    if ($('information-dialog').open) $('information-dialog').close();
    closeSelection();
    updateFilterLabels();
    updateMap();
  }

  async function loadMap() {
    $('map-container').setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('./maps.svg');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const documentSvg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (documentSvg.querySelector('parsererror') || documentSvg.documentElement.localName !== 'svg') throw new Error('SVG tidak valid');
      map = document.importNode(documentSvg.documentElement, true);
      const groups = [...map.querySelectorAll('g[id^="province_piece_"]')];
      if (groups.length !== pieceToRegion.size || groups.some((node) => !pieceToRegion.has(node.id))) throw new Error('Pemetaan wilayah tidak cocok dengan SVG');
      map.removeAttribute('width');
      map.removeAttribute('height');
      map.setAttribute('role', 'group');
      map.setAttribute('aria-label', 'Peta perkara Indonesia. Gunakan Tab untuk memilih provinsi dan Enter untuk melihat detail.');
      map.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      for (const region of data.regions) {
        const nodes = region.pieces.map((piece) => map.querySelector(`#province_piece_${String(piece).padStart(3, '0')}`));
        nodesByRegion.set(region.id, nodes);
        for (const [index, node] of nodes.entries()) {
          node.dataset.region = region.id;
          node.setAttribute('fill', colorOf(region));
          node.setAttribute('role', 'button');
          node.setAttribute('aria-label', `${region.name}, ${format.format(casesOf(region))} perkara, kategori ${labels[categoryOf(region)].toLowerCase()}, ${periodLabel()}, data contoh`);
          node.setAttribute('tabindex', index === 0 ? '0' : '-1');
          node.addEventListener('click', (event) => {
            event.stopPropagation();
            selectRegion(region);
          });
          node.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              selectRegion(region);
            }
          });
          node.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') hoverRegion(region, event); });
          node.addEventListener('pointermove', positionHover);
          node.addEventListener('pointerleave', clearHover);
          node.addEventListener('focus', () => { for (const piece of nodes) piece.classList.add('hovered'); });
          node.addEventListener('blur', () => { for (const piece of nodes) piece.classList.remove('hovered'); });
        }
      }
      $('map-container').replaceChildren(map);
      updateMap();
    } catch (error) {
      map = null;
      console.error('Gagal memuat peta:', error);
      const container = document.createElement('div');
      container.className = 'map-error';
      const title = document.createElement('strong');
      title.textContent = 'Peta belum dapat dimuat.';
      const description = document.createElement('p');
      description.textContent = location.protocol === 'file:' ? 'Buka melalui http://maps-rubrik.test atau jalankan npm run dev. Peta perlu dibuka melalui server lokal.' : 'Pastikan file maps.svg tersedia, lalu coba lagi.';
      const button = document.createElement('button');
      button.className = 'retry-button';
      button.textContent = 'Coba lagi';
      button.addEventListener('click', loadMap);
      container.append(title, description, button);
      $('map-container').replaceChildren(container);
    } finally {
      $('map-container').setAttribute('aria-busy', 'false');
    }
  }

  $('legend-none').textContent = '0 · Tidak ada';
  $('legend-low').textContent = `1–${data.thresholds.medium - 1} · Rendah`;
  $('legend-medium').textContent = `${data.thresholds.medium}–${data.thresholds.high - 1} · Sedang`;
  $('legend-high').textContent = `≥ ${data.thresholds.high} · Tinggi`;

  for (const year of years) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    $('year-filter').append(option);
  }

  $('island-filter').addEventListener('change', (event) => {
    state.island = event.target.value;
    changeFilters();
  });
  $('year-filter').addEventListener('change', (event) => {
    state.year = event.target.value;
    changeFilters();
  });
  $('preview-mode').addEventListener('change', (event) => {
    state.preview = event.target.value;
    changeFilters();
  });
  $('open-information').addEventListener('click', openInformation);
  $('close-information').addEventListener('click', () => $('information-dialog').close());
  $('information-dialog').addEventListener('close', () => {
    $('open-information').setAttribute('aria-expanded', 'false');
    $('open-information').classList.remove('active');
  });
  $('information-dialog').addEventListener('click', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) event.currentTarget.close();
  });
  $('previous-region').addEventListener('click', (event) => {
    event.stopPropagation();
    navigateRegion(-1);
  });
  $('next-region').addEventListener('click', (event) => {
    event.stopPropagation();
    navigateRegion(1);
  });
  for (const button of document.querySelectorAll('[data-category]')) button.addEventListener('click', () => {
    state.category = button.dataset.category;
    if (state.category !== 'all') state.preview = 'color';
    changeFilters();
  });
  $('reset').addEventListener('click', () => {
    state.island = 'all';
    state.year = 'all';
    state.category = 'all';
    state.preview = 'green';
    $('island-filter').value = 'all';
    $('year-filter').value = 'all';
    changeFilters();
  });
  $('close-popover').addEventListener('click', () => {
    const previous = state.selected;
    closeSelection();
    nodesByRegion.get(previous)?.[0].focus({ preventScroll: true });
  });
  $('map-stage').addEventListener('click', (event) => { if (!event.target.closest('.map-popover') && !event.target.closest('[data-region]')) closeSelection(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && $('information-dialog').open) {
      event.preventDefault();
      $('information-dialog').close();
    } else if (event.key === 'Escape') {
      const previous = state.selected;
      closeSelection();
      clearHover();
      if (previous) nodesByRegion.get(previous)?.[0].focus({ preventScroll: true });
    }
  });
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { clearHover(); positionPopover(); });
  });

  updateFilterLabels();
  loadMap();
})();
