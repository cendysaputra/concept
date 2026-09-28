/* Edit casesByYear di bawah dengan jumlah perkara sebenarnya per tahun.
 * Angka tahun 2023-2025 merupakan data contoh; Semua tahun menjumlahkan tahun yang tersedia.
 * pieces menghubungkan ID province_piece_NNN pada maps.svg ke provinsi.
 * SVG sumber menggunakan 34 provinsi, termasuk dua wilayah Papua.
 */
window.MAP_DATA = {
  thresholds: { medium: 20, high: 30 },
  regions: [
    { id: 'aceh', name: 'Aceh', island: 'Sumatera', casesByYear: { 2023: 8, 2024: 10, 2025: 24 }, pieces: [72, 59, 60] },
    { id: 'sumut', name: 'Sumatera Utara', island: 'Sumatera', casesByYear: { 2023: 4, 2024: 5, 2025: 9 }, pieces: [71, 58] },
    { id: 'sumbar', name: 'Sumatera Barat', island: 'Sumatera', casesByYear: { 2023: 10, 2024: 8, 2025: 17 }, pieces: [73, 53, 54, 55, 56, 57] },
    { id: 'riau', name: 'Riau', island: 'Sumatera', casesByYear: { 2023: 3, 2024: 4, 2025: 9 }, pieces: [69, 66, 67] },
    { id: 'kepri', name: 'Kepulauan Riau', island: 'Sumatera', casesByYear: { 2023: 5, 2024: 5, 2025: 12 }, pieces: [61, 62, 63, 64, 65] },
    { id: 'jambi', name: 'Jambi', island: 'Sumatera', casesByYear: { 2023: 7, 2024: 7, 2025: 10 }, pieces: [70] },
    { id: 'sumsel', name: 'Sumatera Selatan', island: 'Sumatera', casesByYear: { 2023: 3, 2024: 4, 2025: 10 }, pieces: [75] },
    { id: 'bengkulu', name: 'Bengkulu', island: 'Sumatera', casesByYear: { 2023: 3, 2024: 3, 2025: 6 }, pieces: [76] },
    { id: 'lampung', name: 'Lampung', island: 'Sumatera', casesByYear: { 2023: 11, 2024: 9, 2025: 19 }, pieces: [74] },
    { id: 'babel', name: 'Kepulauan Bangka Belitung', island: 'Sumatera', casesByYear: { 2023: 0, 2024: 0, 2025: 0 }, pieces: [50, 51, 52] },
    { id: 'banten', name: 'Banten', island: 'Jawa', casesByYear: { 2023: 9, 2024: 9, 2025: 19 }, pieces: [7] },
    { id: 'jakarta', name: 'DKI Jakarta', island: 'Jawa', casesByYear: { 2023: 20, 2024: 20, 2025: 28 }, pieces: [4, 6] },
    { id: 'jabar', name: 'Jawa Barat', island: 'Jawa', casesByYear: { 2023: 11, 2024: 14, 2025: 31 }, pieces: [5] },
    { id: 'jateng', name: 'Jawa Tengah', island: 'Jawa', casesByYear: { 2023: 6, 2024: 7, 2025: 13 }, pieces: [2] },
    { id: 'yogyakarta', name: 'DI Yogyakarta', island: 'Jawa', casesByYear: { 2023: 0, 2024: 0, 2025: 0 }, pieces: [8] },
    { id: 'jatim', name: 'Jawa Timur', island: 'Jawa', casesByYear: { 2023: 3, 2024: 5, 2025: 11 }, pieces: [3, 11, 12, 13] },
    { id: 'bali', name: 'Bali', island: 'Bali & Nusa Tenggara', casesByYear: { 2023: 5, 2024: 5, 2025: 11 }, pieces: [9, 10] },
    { id: 'ntb', name: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', casesByYear: { 2023: 4, 2024: 4, 2025: 6 }, pieces: [14, 15, 16] },
    { id: 'ntt', name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', casesByYear: { 2023: 6, 2024: 8, 2025: 19 }, pieces: [17, 18, 19, 20, 21, 22, 23, 24, 68] },
    { id: 'kalbar', name: 'Kalimantan Barat', island: 'Kalimantan', casesByYear: { 2023: 6, 2024: 7, 2025: 12 }, pieces: [1, 45] },
    { id: 'kalteng', name: 'Kalimantan Tengah', island: 'Kalimantan', casesByYear: { 2023: 12, 2024: 10, 2025: 19 }, pieces: [49] },
    { id: 'kalsel', name: 'Kalimantan Selatan', island: 'Kalimantan', casesByYear: { 2023: 3, 2024: 4, 2025: 8 }, pieces: [48] },
    { id: 'kaltim', name: 'Kalimantan Timur', island: 'Kalimantan', casesByYear: { 2023: 7, 2024: 7, 2025: 14 }, pieces: [46] },
    { id: 'kaltara', name: 'Kalimantan Utara', island: 'Kalimantan', casesByYear: { 2023: 2, 2024: 2, 2025: 3 }, pieces: [47] },
    { id: 'sulut', name: 'Sulawesi Utara', island: 'Sulawesi', casesByYear: { 2023: 2, 2024: 2, 2025: 7 }, pieces: [32, 33, 34, 36] },
    { id: 'gorontalo', name: 'Gorontalo', island: 'Sulawesi', casesByYear: { 2023: 0, 2024: 0, 2025: 0 }, pieces: [40] },
    { id: 'sulteng', name: 'Sulawesi Tengah', island: 'Sulawesi', casesByYear: { 2023: 10, 2024: 9, 2025: 17 }, pieces: [35, 38] },
    { id: 'sulbar', name: 'Sulawesi Barat', island: 'Sulawesi', casesByYear: { 2023: 2, 2024: 0, 2025: 5 }, pieces: [39] },
    { id: 'sulsel', name: 'Sulawesi Selatan', island: 'Sulawesi', casesByYear: { 2023: 4, 2024: 4, 2025: 10 }, pieces: [41] },
    { id: 'sultra', name: 'Sulawesi Tenggara', island: 'Sulawesi', casesByYear: { 2023: 6, 2024: 6, 2025: 11 }, pieces: [37, 42, 43, 44] },
    { id: 'maluku', name: 'Maluku', island: 'Maluku', casesByYear: { 2023: 6, 2024: 8, 2025: 18 }, pieces: [25, 26, 27, 28, 29, 30, 84, 85, 86] },
    { id: 'malut', name: 'Maluku Utara', island: 'Maluku', casesByYear: { 2023: 3, 2024: 3, 2025: 7 }, pieces: [87, 88, 89, 90, 91, 92] },
    { id: 'papbar', name: 'Papua Barat', island: 'Papua', casesByYear: { 2023: 8, 2024: 6, 2025: 13 }, pieces: [77, 79, 82, 83] },
    { id: 'papua', name: 'Papua', island: 'Papua', casesByYear: { 2023: 3, 2024: 4, 2025: 9 }, pieces: [31, 78, 80, 81] },
  ],
};

// Data orang untuk preview, seluruh nama dan jabatan di sini adalah contoh.
// Ganti generator ini dengan array information berisi data sebenarnya:
// { regionId: 'aceh', name: 'Nama', position: 'Jabatan', year: 2025, photo: null }
(() => {
  const positions = ['Anggota DPRD', 'Kepala Dinas', 'Pejabat Pemerintah Daerah', 'Direktur BUMD', 'Pihak Swasta'];
  window.MAP_DATA.information = window.MAP_DATA.regions.flatMap((region, regionIndex) => {
    let sequence = 0;
    return Object.entries(region.casesByYear).flatMap(([year, count]) => Array.from({ length: count }, () => {
      sequence++;
      return {
        id: `${region.id}-${year}-${sequence}`,
        regionId: region.id,
        name: `Nama contoh ${String(sequence).padStart(3, '0')}`,
        position: positions[(sequence + regionIndex) % positions.length],
        year: Number(year),
        photo: null,
      };
    }));
  });
})();
