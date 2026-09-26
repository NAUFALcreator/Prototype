# ChargeKita

Platform manajemen jaringan SPKLU & Battery Swap (Next.js + PostgreSQL).

## Fitur
- Login & Autentikasi (role: user / operator)
- Map & Status — peta interaktif (Leaflet + OpenStreetMap, gratis tanpa API key) menampilkan titik lokasi stasiun berwarna sesuai status, plus daftar kartu di bawahnya
- Manajemen SPKLU (tambah/edit/hapus stasiun, termasuk koordinat lokasi)
- Riwayat Aktivitas
- Monitoring Baterai

## 1. Jalankan Lokal

```bash
npm install
cp .env.example .env
# isi DATABASE_URL dan JWT_SECRET di .env
```

Buat database PostgreSQL (bisa pakai [Neon](https://neon.tech) versi gratis), lalu jalankan isi `schema.sql` di database tersebut (lewat SQL editor Neon, atau `psql`):

```bash
psql "$DATABASE_URL" -f schema.sql
```

Jalankan aplikasi:

```bash
npm run dev
```

Buka http://localhost:3000

## 2. Deploy ke Vercel (domain sendiri)

1. Push folder ini ke repo GitHub (repo boleh privat).
2. Buat database Postgres — paling gampang lewat **Vercel Storage → Postgres** (dari Neon), atau bikin manual di [neon.tech](https://neon.tech) lalu salin connection string-nya.
3. Jalankan `schema.sql` di database itu (lewat SQL editor di dashboard Neon/Vercel Postgres).
4. Di [vercel.com](https://vercel.com), klik **Add New Project**, import repo GitHub ini.
5. Di bagian **Environment Variables**, isi:
   - `DATABASE_URL` = connection string database kamu
   - `JWT_SECRET` = string acak bebas (misal hasil dari `openssl rand -hex 32`)
6. Klik **Deploy**. Setelah selesai, Vercel kasih domain otomatis (`xxx.vercel.app`).
7. Mau pakai domain sendiri? Buka **Project → Settings → Domains**, tambahkan domain kamu dan ikuti instruksi DNS yang muncul.

## Struktur Folder

```
app/
  login/          -> halaman login
  register/       -> halaman daftar akun
  dashboard/       -> Map & Status
  spklu/           -> Manajemen SPKLU
  history/         -> Riwayat Aktivitas
  battery/         -> Monitoring Baterai
  api/             -> semua endpoint backend (auth, stations, activities, battery)
lib/
  db.js            -> koneksi PostgreSQL
  auth.js          -> hash password & session login (JWT di cookie)
schema.sql          -> struktur tabel database
```

## Catatan
- Peta pakai Leaflet + tile OpenStreetMap (gratis, tanpa perlu daftar API key). Supaya sebuah stasiun muncul di peta, isi kolom **Latitude** & **Longitude** saat menambah/edit stasiun di halaman Manajemen SPKLU (ambil dari Google Maps: klik kanan lokasi → klik koordinat yang muncul → tempel di sini).
- Semua endpoint di `app/api` masih bisa diakses tanpa login (belum ada proteksi role di server). Untuk keperluan tugas kuliah ini cukup, tapi kalau mau lebih aman tambahkan pengecekan `getUserFromRequest` di setiap route sebelum query database.
- Sudah dites: `npm run build` sukses tanpa error, dan semua halaman (`/login`, `/register`, `/dashboard`, `/spklu`, `/history`, `/battery`) merender 200 OK.
