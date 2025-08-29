Inti & Editing

- CRUD interaktif: Tambah/edit/hapus orang, pasangan, status (menikah/cerai), dengan validasi usia/generasi.
- Hubungan kompleks: Adopsi, orang tua tiri, saudara tiri, multi-spouse dengan rentang waktu.
- Catatan & sumber: Kolom catatan, lampiran dokumen, dan referensi sumber (citations).

Visualisasi

- Fokus node: Klik node → sorot jalur ke root/anak; tombol “fokus ke pilihan”.
- Mini-map: Peta kecil untuk navigasi cepat di pohon besar.
- Tingkat generasi: Collapse/expand per generasi; slider untuk kedalaman terlihat.
- Layout alternatif: Horizontal/indented, dengan auto-spacing agar tidak saling tumpang tindih.

Pencarian & Filter

- Pencarian cepat: Nama/alias/tahun lahir, highlight hasil di kanvas.
- Filter: Tampilkan hanya garis keturunan tertentu, generasi N, atau status pernikahan.

Data & Integrasi

- Import/Export: JSON dan GEDCOM; validasi & merge duplikat.
- Versi & restore: Riwayat perubahan per pohon; undo/redo.
- Statistika: Hitung generasi, sebaran umur, jumlah keturunan, dsb.

Kolaborasi & Privasi

- Peran/akses: Admin/editor/viewer; visibilitas data sensitif untuk anggota hidup.
- Audit log: Siapa mengubah apa & kapan; komentar/mention per node.

UX & Aksesibilitas

- Kartu adaptif: Mode compact/expanded; foto profil; avatar otomatis dari inisial.
- Keyboard shortcuts: Navigasi antar node, zoom, expand/collapse.
- A11y: Focus ring konsisten, ARIA untuk pohon & tombol, kontras warna.
- Cetak/ekspor: Tampilan print-friendly, ekspor PNG/SVG berkualitas tinggi.

Performa & Kualitas

- Virtualisasi: Render lazy/virtual untuk pohon besar; cache posisi.
- Persistensi view: Simpan zoom/posisi terakhir per device.
- PWA/offline: Bisa dipakai offline, sinkron saat online.

Quick wins yang bisa langsung saya kerjakan

- Fokus node + sorot jalur ke root.
- Pencarian nama dengan highlight hasil.
- Ekspor PNG/SVG dari kanvas saat ini.






=============

Layout & Orientasi

- Vertikal: generasi turun ke bawah; paling natural di seluler.
- Horizontal: cocok untuk layar lebar dan cetak dinding.
- Radial: pusat ke luar untuk menyorot seorang tokoh.
- Mini‑map: pratinjau keseluruhan + kotak tampilan aktif.

Desain Node

- Avatar + Nama: bulat, inisial jika tanpa foto; nama 1–2 baris.
- Badge Status: married/divorced/adopted, gender opsional.
- Kode Warna Keluarga: klan/cabang mendapat warna lembut konsisten.
- Ukuran Adaptif: perkecil detail saat zoom jauh (hanya avatar).

Hubungan & Visual

- Pasangan: garis horizontal halus; putus‑putus untuk bercerai.
- Parent→Child: garis ortogonal; adopsi dengan pola putus‑putus.
- Multi‑spouse: urut kronologis dengan label tahun/pernikahan.
- Legenda: contoh ikon/garis untuk memahamkan pola visual.

Navigasi & Fokus

- Zoom/Pan: dua jari di mobile, gulir + drag di desktop.
- Fokus Node: sorot jalur leluhur/keturunan; blur cabang lain.
- Expand/Collapse: per cabang; “Expand level N” cepat.
- Breadcrumb: “Kakek > Ayah > Saya” untuk orientasi.

Pencarian & Filter

- Pencarian Nama: hasil menyorot node + tombol “lompat”.
- Filter Cepat: generasi (≤N), status (hidup/meninggal), lokasi.
- Sorot Kriteria: garis atau halo saat filter aktif.
- Daftar Hasil: panel samping/lembar bawah dengan preview kecil.

Detail Kontekstual

- Panel Ringkas: muncul saat pilih node (pasangan, anak, catatan).
- Tindakan Cepat: “Pusatkan”, “Tampilkan keturunan”, “Sembunyikan cabang”.
- Timeline Mini: kelahiran/nikah/meninggal sebagai chip waktu.
- Foto & Dokumen: galeri ringan di panel detail.

Pengeditan & Kolaborasi

- Mode Edit Terpisah: tombol masuk/keluar, cegah salah sentuh.
- Form Bertahap: tambah orang > hubungan > detail opsional.
- Validasi Lembut: cegah siklus/usia tidak logis dengan tip jelas.
- Riwayat Perubahan: siapa mengubah, kapan; undo singkat.

Aksesibilitas & Responsif

- Target Sentuh ≥44px, kontras warna AA, fokus keyboard jelas.
- Bahasa & Nama Lokal: dukung variasi penulisan nama.
- Tema Gelap/Terang: konsisten dengan sistem.
- Cetak/Ekspor: tata letak rapi ke PNG/PDF/SVG dengan judul/legend.