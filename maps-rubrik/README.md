# Peta perkara Indonesia

Model interaktif menggunakan `maps.svg` yang tersedia di folder ini. Dibuat dengan HTML, CSS, dan JavaScript tanpa dependensi aplikasi.

## Membuka

Dengan Laravel Herd, buka `http://maps-rubrik.test`.

Alternatif: jalankan `npm run dev`, lalu buka `http://127.0.0.1:3011`. Tidak perlu menjalankan `npm install`.

Buka melalui server lokal agar browser dapat membaca SVG.

## Perilaku

- Klik atau sentuh provinsi untuk menampilkan nama daerah, jumlah perkara, dan kategorinya.
- Tombol Informasi muncul setelah memilih kelompok wilayah. Tombol ini membuka popup berisi foto placeholder, nama, jabatan, dan tahun. Daftar mengikuti wilayah, tahun, dan kategori aktif. Tooltip hover dan popup singkat saat klik provinsi tetap tersedia.
- Semua potongan pulau yang termasuk provinsi yang sama memiliki warna dan detail yang sama.
- Filter Preview di sebelah Semua kategori menyediakan pilihan Biru (`#ADC3DA`) dan Warna (warna masing-masing kategori). Filter ini mengubah warna tampilan tanpa mengubah data, wilayah, atau tahun.
- Memilih Tinggi, Sedang, atau Rendah otomatis mengaktifkan preview Warna untuk kategori tersebut. Memilih Semua kategori mengikuti mode preview yang aktif. Tombol reset mengembalikan preview Biru.
- Merah: 30 perkara atau lebih; oranye: 20–29; kuning: 0–19.
- Filter kategori dan kelompok wilayah memperbarui peta serta tabel. Memilih kelompok wilayah hanya menampilkan peta wilayah tersebut dan memperbesar tampilannya; semua kelompok wilayah lainnya disembunyikan. Pilihan Semua wilayah menampilkan kembali seluruh peta.
- Saat kelompok wilayah tertentu dipilih, panah kiri dan kanan pada peta berpindah antarwilayah mengikuti urutan dropdown. Dari Papua, panah kanan kembali ke Sumatera. Filter tahun dan kategori tetap mengikuti pilihan sebelumnya.
- Filter tahun di sebelah filter wilayah memperbarui jumlah perkara, warna kategori, detail daerah, dan popup Informasi. Pilihan Semua tahun menjumlahkan data semua tahun yang tersedia. Model ini menyediakan data contoh tahun 2023, 2024, dan 2025.
- Gunakan Tab untuk menavigasi provinsi, Enter/Space untuk membuka detail, dan Escape untuk menutupnya.
- Tombol reset mengembalikan peta dan filter ke tampilan awal.

## Data dan batas wilayah

**Semua jumlah perkara merupakan data contoh, bukan data resmi.** Ubah `casesByYear` di `data.js` untuk memasukkan jumlah perkara sebenarnya per tahun, misalnya `casesByYear: { 2023: 8, 2024: 12, 2025: 20 }`. Daftar pilihan tahun mengikuti tahun yang tersedia dalam data. Batas kategori dapat diubah melalui `thresholds.medium` dan `thresholds.high`.

`pieces` menghubungkan satu provinsi dengan ID `province_piece_NNN` pada SVG. Ada 92 potongan peta yang dihubungkan ke 34 provinsi. Peta mengikuti geometri SVG sumber, termasuk representasi Papua sebagai Papua dan Papua Barat; SVG ini belum memuat batas provinsi baru di Papua. Pengaitan nama provinsi dilakukan berdasarkan posisi dan bentuk pada SVG dan perlu dicocokkan dengan data geospasial resmi sebelum publikasi.

Jika mengganti data contoh dengan data resmi, sesuaikan juga label sumber dan keterangan data pada `index.html` dan `app.js`.

Popup Informasi menggunakan `MAP_DATA.information`. Untuk preview, array ini dibuat dari `casesByYear`, dengan satu catatan contoh per perkara. Semua nama berupa `Nama contoh 001` dan seterusnya, serta jabatan contoh. Ganti generator di bagian bawah `data.js` dengan array data sebenarnya, misalnya `{ regionId: 'aceh', name: 'Nama', position: 'Jabatan', year: 2025, photo: null }`. Foto saat ini selalu menggunakan placeholder.

## Verifikasi browser

`npm run check` memeriksa 92 potongan SVG, detail 34 provinsi, preview Biru/Warna, filter, akses keyboard, popup Informasi, dan tampilan ponsel. Skrip ini membutuhkan Playwright dan Google Chrome yang tersedia di lingkungan pengujian. Server lokal harus berjalan terlebih dahulu. Gunakan variabel lingkungan `PREVIEW_URL` untuk menguji alamat lain, misalnya alamat Herd.

Pengujian tidak membuat file screenshot secara default. Untuk menyimpannya, tentukan folder tujuan melalui variabel lingkungan `SCREENSHOTS_DIR`.

File aplikasi: `index.html`, `styles.css`, `app.js`, `data.js`, dan `maps.svg`. Folder `tools/` berisi server lokal dan pemeriksaan browser; `package.json` menyediakan perintah untuk menjalankannya.
