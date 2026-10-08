# 💼 JobHunt — Fullstack Talent & Career Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-black?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479a1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85ea2d?logo=swagger&logoColor=black)](http://localhost:5000/api-docs)

> **JobHunt** adalah aplikasi web fullstack untuk pencarian lowongan kerja dan rekrutmen talenta teknologi. Proyek ini menghubungkan **Pencari Kerja (Job Seeker)** dengan **Perekrut (Recruiter)** melalui sistem berbasis RESTful API dan antarmuka modern yang responsif.

---

## 📑 Daftar Isi

1. [Tentang Proyek](#-tentang-proyek)
2. [Alur Peran & Fitur Pengguna](#-alur-peran--fitur-pengguna)
3. [Akun Demo Siap Pakai](#-akun-demo-siap-pakai)
4. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
5. [Prasyarat Sistem](#-prasyarat-sistem)
6. [Panduan Instalasi Langkah demi Langkah](#-panduan-instalasi-langkah-demi-langkah)
   - [Langkah 1: Download / Clone Proyek](#langkah-1-download--clone-proyek)
   - [Langkah 2: Menyiapkan Database MySQL](#langkah-2-menyiapkan-database-mysql)
   - [Langkah 3: Konfigurasi & Menjalankan Backend](#langkah-3-konfigurasi--menjalankan-backend)
   - [Langkah 4: Konfigurasi & Menjalankan Frontend](#langkah-4-konfigurasi--menjalankan-frontend)
7. [Dokumentasi API & Swagger UI](#-dokumentasi-api--swagger-ui)
8. [Tabel Lengkap Endpoint API](#-tabel-lengkap-endpoint-api)
9. [Struktur Folder Proyek](#-struktur-folder-proyek)
10. [Panduan Pemecahan Masalah (Troubleshooting)](#-panduan-pemecahan-masalah-troubleshooting)

---

## 💡 Tentang Proyek

Platform ini dirancang untuk memudahkan proses rekrutmen:
- **Pencari Kerja** dapat mencari pekerjaan impian, melihat rincian gaji, mengirim lamaran dengan cover letter, dan memantau status lamaran secara berkala.
- **Perekrut** memiliki konsol khusus untuk mempublikasikan lowongan, meninjau berkas kandidat yang masuk, dan memperbarui status tahapan rekrutmen kandidat secara langsung.

Semua data tersimpan rapi di database MySQL, diamankan menggunakan otentikasi token JWT (JSON Web Token), dan password pengguna dienkripsi dengan standar keamanan Bcrypt.

---

## 👥 Alur Peran & Fitur Pengguna

Aplikasi memiliki pemisahan peran yang jelas (*Role-Based Access Control*):

| Fitur | Pencari Kerja (*Job Seeker*) | Perekrut (*Recruiter*) |
|---|:---:|:---:|
| Jelajah Lowongan Pekerjaan | ✅ Ya | ❌ *(Difokuskan ke Console)* |
| Filter & Pencarian Lowongan | ✅ Ya | ❌ |
| Simpan Lowongan (Bookmark) | ✅ Ya | ❌ |
| Kirim Lamaran Pekerjaan | ✅ Ya | ❌ |
| Pelacakan Status Lamaran | ✅ Ya | ❌ |
| Dashboard Rekapitulasi Data | ❌ | ✅ Ya |
| Posting Lowongan Baru | ❌ | ✅ Ya |
| Edit & Hapus Lowongan Milik Sendiri | ❌ | ✅ Ya |
| Tinjau Pelamar & Ubah Status | ❌ | ✅ Ya |
| Akses Candidate Bench | ❌ | ✅ Ya |

---

## 🔑 Akun Demo Siap Pakai

Untuk memudahkan pengujian langsung tanpa perlu registrasi manual dari awal, Anda dapat langsung menggunakan akun demo berikut:

### 1. Akun Pencari Kerja (Job Seeker)
- **Email:** `budi@example.com`
- **Password:** `password123`
- **Peran:** `job_seeker`
- **Akses:** Menjelajahi lowongan, melamar pekerjaan, dan memantau riwayat lamaran.

### 2. Akun Perekrut (Recruiter)
- **Email:** `recruiters@example.com`
- **Password:** `password123`
- **Peran:** `recruiter`
- **Akses:** Dashboard recruiter, posting lowongan, mengelola lowongan, mereview pelamar, dan candidate bench.

---

## 🛠 Teknologi yang Digunakan

### Backend (Server)
- **Node.js (v18+)** — Lingkungan eksekusi JavaScript server-side.
- **Express.js (v5)** — Framework web dan perutean (routing) REST API.
- **MySQL2** — Driver koneksi database MySQL dengan dukungan connection pool dan async/await.
- **JSON Web Token (JWT)** — Mekanisme otentikasi sesi berbasis Bearer token.
- **BcryptJS** — Enkripsi hashing password pengguna.
- **Swagger UI & OpenAPI 3.0** — Dokumentasi interaktif REST API bawaan.

### Frontend (Tampilan Pengguna)
- **React 18** — Library komponen antarmuka pengguna interaktif.
- **Vite** — Build tool generasi terbaru dengan performa tinggi dan fast refresh.
- **Tailwind CSS** — Framework styling utility-first untuk desain modern dan responsif.
- **React Router DOM v6** — Manajemen navigasi dan halaman tanpa reload (SPA).
- **Lucide React** — Kumpulan ikon antarmuka modern.

---

## 💻 Prasyarat Sistem

Sebelum memulai, pastikan perangkat komputer/laptop Anda telah terpasang:
1. **Node.js** (versi 18.x atau lebih baru)  
   👉 [Unduh Node.js Resmi](https://nodejs.org/) *(pilih versi LTS)*
2. **MySQL Database Server**  
   Bisa menggunakan salah satu dari:
   - **XAMPP** (aktifkan modul MySQL di kontrol panel) 👉 [Unduh XAMPP](https://www.apachefriends.org/)
   - **Laragon** (aktifkan MySQL) 👉 [Unduh Laragon](https://laragon.org/)
   - **MySQL Community Server lokal**
3. **Web Browser** modern (Google Chrome, Mozilla Firefox, Microsoft Edge, dll).
4. **Git** (opsional, untuk clone repository).

---

## 🚀 Panduan Instalasi Langkah demi Langkah

### Langkah 1: Download / Clone Proyek

Buka **Terminal** atau **PowerShell**, lalu arahkan ke folder yang Anda inginkan:

```bash
git clone https://github.com/adialex30/-jobhunt-fullstack.git
cd -jobhunt-fullstack
```

*(Atau jika Anda mengunduh file `.zip`, ekstrak foldernya dan buka terminal di dalam folder tersebut).*

---

### Langkah 2: Menyiapkan Database MySQL

1. Pastikan layanan MySQL Anda sudah berjalan (misal: tombol **Start** pada MySQL di XAMPP / Laragon sudah menyala hijau).
2. Buka aplikasi manajemen database favorit Anda (seperti **phpMyAdmin** di browser via `http://localhost/phpmyadmin`, **DBeaver**, **HeidiSQL**, atau terminal MySQL).
3. Buat database baru bernama `jobhunt_db`.
4. Import file SQL siap pakai yang telah disediakan di dalam folder `backend/database.sql`:
   - Di **phpMyAdmin**: Klik tab **Import** ➜ Pilih file `backend/database.sql` ➜ Klik tombol **Go / Kirim**.

### Langkah 3: Konfigurasi & Menjalankan Backend

1. Buka jendela terminal pertama, lalu masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Pastikan file `.env` di dalam folder `backend/` sudah ada dan sesuai dengan pengaturan database Anda:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=jobhunt_db
   JWT_SECRET=super_secret_jwt_key_jobhunt_2026
   FRONTEND_URL=http://localhost:5173
   ```
   *(Jika MySQL Anda menggunakan password, isi `DB_PASSWORD=password_anda`).*

3. Install dependensi modul backend (jika belum):
   ```bash
   npm install
   ```
4. Jalankan server backend:
   ```bash
   npm run dev
   ```
5. Jika berhasil, terminal akan menampilkan output:
   ```text
   Connected to Database: jobhunt_db
   Server backend berjalan di http://localhost:5000 (0.0.0.0:5000)
   API Jobs: http://localhost:5000/api/jobs
   Swagger Docs: http://localhost:5000/api-docs
   Health check: http://localhost:5000/api/health
   ```

---

### Langkah 4: Konfigurasi & Menjalankan Frontend

1. Buka jendela terminal kedua (jangan tutup terminal backend), lalu masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependensi modul frontend (jika belum):
   ```bash
   npm install
   ```
3. Jalankan server development frontend:
   ```bash
   npm run dev
   ```
4. Buka browser Anda dan akses alamat:
   👉 **`http://localhost:5173`**

Aplikasi JobHunt sekarang sudah berjalan penuh dan siap digunakan! 🎉

---

## 📖 Dokumentasi API & Swagger UI

Backend JobHunt sudah dilengkapi dengan dokumentasi interaktif **Swagger (OpenAPI 3.0)** yang dapat langsung diakses melalui peramban:

- **Alamat Swagger UI:**  
  👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**  
  *(Atau alternatif: `http://localhost:5000/docs`)*
- **Alamat Raw Spesifikasi JSON:**  
  👉 `http://localhost:5000/api/docs/swagger.json`  
  *(File lokal juga tersedia di [`backend/swagger.json`](./backend/swagger.json) dan [`swagger.json`](./swagger.json)).*

### 🧪 Cara Menguji API di Swagger UI:
1. Buka `http://localhost:5000/api-docs` di browser.
2. Buka kelompok endpoint **Auth** ➜ klik **`POST /api/auth/login`**.
3. Klik tombol **Try it out** di kanan atas.
4. Masukkan salah satu akun demo:
   ```json
   {
     "email": "budi@example.com",
     "password": "password123"
   }
   ```
5. Klik **Execute**. Pada bagian respons, salin teks kode `token`.
6. Gulir ke bagian paling atas halaman, klik tombol hijau **Authorize 🔓**.
7. Tempelkan token yang Anda salin tadi ke kolom **Value**, lalu klik **Authorize**.
8. Sekarang semua endpoint yang membutuhkan login (bertanda gembok) dapat langsung Anda uji dan jalankan!

---

## 📡 Tabel Lengkap Endpoint API

### 1. Autentikasi Pengguna (`/api/auth`)
| Method | Endpoint | Akses | Keterangan |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | Publik | Mendaftarkan akun baru (`job_seeker` atau `recruiter`) |
| `POST` | `/api/auth/login` | Publik | Masuk ke sistem dan mendapatkan token JWT |
| `GET` | `/api/auth/me` | Login | Mendapatkan informasi profil pengguna yang sedang login |

### 2. Lowongan Pekerjaan (`/api/jobs`)
| Method | Endpoint | Akses | Keterangan |
|---|---|:---:|---|
| `GET` | `/api/jobs` | Publik | Menampilkan daftar lowongan (mendukung filter & pagination) |
| `GET` | `/api/jobs/stats` | Publik | Ringkasan statistik total lowongan dan jenis pekerjaan |
| `GET` | `/api/jobs/mine` | Recruiter | Menampilkan lowongan yang diposting oleh recruiter login |
| `GET` | `/api/jobs/:id` | Publik | Menampilkan detail lengkap satu lowongan |
| `POST` | `/api/jobs` | Recruiter | Menerbitkan lowongan pekerjaan baru |
| `PUT` | `/api/jobs/:id` | Recruiter | Memperbarui informasi lowongan pekerjaan |
| `DELETE` | `/api/jobs/:id` | Recruiter | Menghapus lowongan pekerjaan secara permanen |

### 3. Lamaran Kerja (`/api/applications`)
| Method | Endpoint | Akses | Keterangan |
|---|---|:---:|---|
| `POST` | `/api/jobs/:id/apply` | Job Seeker | Mengajukan lamaran pada lowongan tertentu |
| `GET` | `/api/applications/mine` | Job Seeker | Melihat riwayat seluruh lamaran yang diajukan |
| `GET` | `/api/jobs/:id/applicants` | Recruiter | Melihat daftar pelamar pada lowongan tertentu |
| `GET` | `/api/applications/dashboard` | Recruiter | Melihat metrik data dashboard recruiter |
| `GET` | `/api/applications/:id` | Login | Melihat data detail satu lamaran |
| `PUT` | `/api/applications/:id` | Recruiter | Mengubah status lamaran (*pending, reviewed, interview, accepted, rejected*) |

### 4. Manajemen Pengguna (`/api/users`)
| Method | Endpoint | Akses | Keterangan |
|---|---|:---:|---|
| `GET` | `/api/users` | Login | Menampilkan daftar pengguna (dapat difilter dengan `?role=job_seeker`) |
| `GET` | `/api/users/:id` | Login | Melihat data profil pengguna berdasarkan ID |
| `PUT` | `/api/users/:id` | Owner/Admin | Memperbarui nama atau profil akun |
| `DELETE` | `/api/users/:id` | Owner/Admin | Menghapus akun pengguna |

---

## 📂 Struktur Folder Proyek

```text
-jobhunt-fullstack/
├── README.md                           # Dokumentasi utama proyek
├── swagger.json                        # File spesifikasi Swagger OpenAPI 3.0
├── Applications_API.postman_collection.json # File koleksi pengujian Postman
│
├── backend/                            # Bagian Server (Node.js & Express)
│   ├── .env                            # Konfigurasi koneksi database & port
│   ├── database.sql                    # Skrip pembuatan tabel database & data awal
│   ├── swagger.json                    # Spesifikasi Swagger lokal backend
│   ├── package.json                    # Daftar pustaka dependensi backend
│   └── src/
│       ├── index.js                    # File utama server Express & Swagger UI
│       ├── config/db.js                # Koneksi ke database MySQL
│       ├── controllers/                # Logika pemrosesan data (Auth, Job, App, User)
│       ├── middleware/                 # Autentikasi JWT & pengecekan peran
│       ├── models/                     # Perintah query database SQL
│       └── routes/                     # Definisi URL rute API
│
└── frontend/                           # Bagian Tampilan (React & Vite)
    ├── index.html                      # Halaman HTML pembuka
    ├── package.json                    # Daftar pustaka dependensi frontend
    ├── vite.config.js                  # Konfigurasi Vite
    └── src/
        ├── App.jsx                     # Komponen inti & navigasi aplikasi
        ├── components/                 # Komponen antarmuka (Header, Footer, Modal)
        ├── context/AuthContext.jsx     # Penyimpan status login pengguna
        ├── hooks/                      # Custom hooks pembantu data
        ├── pages/                      # Halaman tampilan (Home, Jobs, Dashboard, dll)
        └── services/                   # Jembatan komunikasi HTTP ke backend API
```

---

## ❓ Panduan Pemecahan Masalah (Troubleshooting)

Berikut adalah solusi untuk kendala yang umum terjadi bagi pemula:

### 1. Error: `ECONNREFUSED 127.0.0.1:3306` saat backend dijalankan
- **Penyebab:** Layanan MySQL di komputer Anda belum dinyalakan atau port MySQL berbeda.
- **Solusi:** Buka XAMPP Control Panel atau Laragon Anda, lalu klik tombol **Start** pada modul **MySQL**. Pastikan port yang digunakan adalah `3306`.

### 2. Error: `Access denied for user 'root'@'localhost'`
- **Penyebab:** Pengaturan password database di file `.env` tidak cocok dengan password MySQL Anda.
- **Solusi:** Buka file `backend/.env`. Jika MySQL Anda memiliki password, isi `DB_PASSWORD=password_anda`. Jika tidak memiliki password (default XAMPP), kosongkan: `DB_PASSWORD=`.

### 3. Error: Port 5000 atau 5173 sudah digunakan (*Port already in use*)
- **Penyebab:** Ada proses backend/frontend sebelumnya yang belum tertutup.
- **Solusi:** 
  - Tutup jendela terminal yang sedang berjalan sebelumnya.
  - Atau ubah angka port di file `.env` (misal: `PORT=5001`).

### 4. Halaman Frontend kosong atau menampilkan pesan "Failed to fetch"
- **Penyebab:** Server backend belum dinyalakan.
- **Solusi:** Pastikan terminal backend tetap berjalan dan menampilkan pesan `Server backend berjalan di http://localhost:5000`. Frontend membutuhkan backend untuk mengambil data.

### 5. Sesi Login Hilang Setelah Refresh
- **Solusi:** Token login disimpan aman di `localStorage` peramban. Jika sesi habis, cukup lakukan login ulang menggunakan akun demo yang tersedia.

---

## 📄 Lisensi & Kontribusi

Proyek ini dibangun untuk tujuan edukasi, portofolio, dan implementasi aplikasi web fullstack modern. Bebas digunakan, dipelajari, dan dikembangkan lebih lanjut.
