# JobHunt Fullstack Application

Platform pencarian kerja dan pelacakan lamaran modern yang menghubungkan **Job Seeker** dan **Recruiter**.

---

## 📌 Branch `feature/application-tracking`

Branch ini mengimplementasikan sistem pelacakan lamaran kerja (*application tracking*) lengkap dengan:
1. **Job Seeker**: Melamar pekerjaan (`POST /api/jobs/:id/apply`) dan memantau riwayat lamaran beserta status (`GET /api/applications/mine`).
2. **Recruiter**: Memantau daftar pelamar untuk lowongan tertentu (`GET /api/jobs/:id/applicants`), mengubah status lamaran (`PUT /api/applications/:id`), dan melihat statistik dashboard (`GET /api/applications/dashboard`).
3. **Jobs & Auth**: Autentikasi JWT dengan Role-Based Access Control (`job_seeker` & `recruiter`), katalog lowongan aktif dengan debounced search, filter tipe/lokasi, dan sorting.

---

## 📖 Dokumentasi API & Postman Collection

- 📑 **Dokumentasi Lengkap API:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 📮 **Postman Collection:** [Applications_API.postman_collection.json](./Applications_API.postman_collection.json)

---

## 🚀 Menjalankan Project Secara Lokal

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Backend akan berjalan di `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`.