# REQUIREMENTS — MVP Family Tree (Know Your Fam)

## Tujuan Produk
- Memudahkan pengguna melacak dan memvisualisasikan silsilah keluarga secara cepat, rapi, dan dapat dibagikan.
- Meminimalkan friksi input data (nama, hubungan, tanggal kunci) dan memastikan validasi dasar agar pohon tetap konsisten.

## Cakupan MVP
- Single-user (tanpa autentikasi), data tersimpan lokal pada perangkat pengguna.
- Input manual anggota keluarga dan hubungan; impor/ekspor sederhana via JSON.
- Visualisasi pohon dasar (hirarki orang tua → anak, pasangan ditampilkan berdampingan).
- Pencarian anggota berdasarkan nama.

## Persona Utama
- Individu keluarga: ingin membuat/melihat pohon keluarga pribadi dan inti.

## Fitur Inti (MVP)
- Manajemen Anggota (CRUD): tambah, lihat, ubah, hapus person.
- Hubungan Keluarga:
  - Orang tua ↔ anak (bisa lebih dari satu orang tua per anak).
  - Pasangan (opsional periode mulai/akhir, mendukung beberapa pasangan di waktu berbeda).
- Visualisasi Pohon: tampilan generasi atas/bawah dari seorang akar (root) yang dipilih.
- Pencarian: cari orang berdasarkan nama/alias.
- Ekspor/Impor JSON: ekspor seluruh data; impor data yang diekspor sebelumnya (validasi kompatibilitas versi minimal).

## Di Luar Cakupan (MVP)
- Multi-user, kolaborasi real-time, dan kontrol akses/role.
- Autentikasi, berbagi tautan publik/privat.
- Impor/ekspor GEDCOM, sinkronisasi cloud.
- Foto/media upload, lampiran dokumen sumber.
- Deteksi dan penggabungan duplikat otomatis tingkat lanjut.

## Alur Utama
1. Pengguna membuat pohon pertama (otomatis dibuat saat menambah orang pertama).
2. Tambah orang (nama wajib; kolom lain opsional).
3. Tetapkan hubungan orang tua → anak atau pasangan.
4. Pilih orang sebagai akar tampilan untuk melihat pohon turunannya atau leluhurnya.
5. Simpan otomatis (lokal) dan/atau ekspor JSON untuk cadangan.

## Model Data Awal
- Person
  - `id` (string, UUID)
  - `fullName` (string, wajib)
  - `givenName` (string, opsional)
  - `familyName` (string, opsional)
  - `gender` (string: `male` | `female` | `other` | `unknown`, opsional)
  - `birth` (object: `{ date?: string, place?: string }`, opsional)
  - `death` (object: `{ date?: string, place?: string }`, opsional)
  - `notes` (string, opsional)
  - `parentIds` (string[])
  - `spouseIds` (string[])
- Relasi (direpresentasikan melalui `parentIds` dan `spouseIds` pada Person untuk kesederhanaan; `childIds` dapat diturunkan secara komputasi)
- Metadata
  - `version` (string, contoh: `1.0.0`)
  - `createdAt` / `updatedAt` (ISO string)

Contoh berkas ekspor JSON singkat:
```json
{
  "version": "1.0.0",
  "people": [
    {
      "id": "p1",
      "fullName": "Andi Setiawan",
      "birth": { "date": "1970-05-01" },
      "parentIds": [],
      "spouseIds": ["p2"]
    },
    {
      "id": "p2",
      "fullName": "Budi Rahma",
      "parentIds": [],
      "spouseIds": ["p1"]
    },
    {
      "id": "p3",
      "fullName": "Citra Setiawan",
      "parentIds": ["p1", "p2"],
      "spouseIds": []
    }
  ],
  "createdAt": "2025-08-29T00:00:00Z",
  "updatedAt": "2025-08-29T00:00:00Z"
}
```

## Aturan & Validasi Dasar
- Tidak boleh ada siklus (seseorang tidak boleh menjadi leluhur dirinya sendiri).
- Seseorang tidak boleh menjadi orang tua/anak/pasangan dirinya sendiri.
- Hindari duplikasi relasi (orang tua yang sama ditambahkan dua kali ke anak yang sama).
- Peringatan (bukan blokir) untuk inkonsistensi usia jelas (contoh: anak lahir sebelum orang tua lahir).

## Non-Fungsional
- Platform: Web, responsif untuk desktop dan mobile.
- Kinerja: Mampu menangani >= 500 orang dan 1.500 relasi dengan interaksi lancar.
- Penyimpanan: Lokal (LocalStorage/IndexedDB) untuk MVP; ekspor JSON sebagai cadangan.
- Aksesibilitas: Navigasi keyboard dasar, kontras yang memadai.

## Kriteria Penerimaan (Acceptance Criteria)
- Tambah Orang
  - Given form tambah orang minimal `fullName`, when disimpan, then orang muncul dalam daftar/pohon.
- Tetapkan Orang Tua
  - Given dua orang A (orang tua) dan B (anak), when A ditetapkan sebagai orang tua B, then B menampilkan A pada daftar orang tua dan muncul pada cabang A.
- Tambah Pasangan
  - Given dua orang A dan B, when ditandai pasangan, then keduanya tampil berdampingan di pohon.
- Visualisasi
  - Given orang dipilih sebagai akar, when membuka tampilan pohon, then terlihat leluhur/keturunan hingga N generasi (mis. 3) dengan pan-zoom dasar.
- Pencarian
  - Given kata kunci nama, when mencari, then hasil menyorot orang yang cocok dan memungkinkan lompat ke node di pohon.
- Ekspor/Impor
  - Given data tersimpan, when ekspor JSON, then berkas valid dengan semua orang/relasi; when impor berkas yang sama, then pohon identik.

## Risiko & Pertanyaan Terbuka
- Apakah butuh dukungan keluarga adopsi/guardian vs. biologis di MVP? (default: satu tipe orang tua umum)
- Apakah perlu tanggal yang tidak pasti (perkiraan) dan wilayah kalender? (tunda)
- Apakah perlu multiple nama/alias per orang? (opsional, bisa `aliases: string[]`)

## Roadmap Singkat (Pasca-MVP)
- Impor/ekspor GEDCOM; sinkronisasi cloud dan multi-user.
- Berbagi tautan read-only; role editor/viewer.
- Foto/media dan lampiran sumber; referensi bukti.
- Deteksi duplikat dan merge semi-otomatis.
