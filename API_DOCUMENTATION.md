# Dokumentasi API - Branch `feature/application-tracking`

Dokumentasi resmi untuk seluruh endpoint REST API pada branch **`feature/application-tracking`** dalam proyek **JobHunt Fullstack**. Dokumentasi ini mencakup modul **Authentication**, **Jobs**, dan **Application Tracking** antara **Job Seeker** dan **Recruiter**.

---

## 1. Ikhtisar & Arsitektur

- **Base URL:** `http://localhost:5000`
- **Prefix Endpoint:** `/api`
- **Header Autentikasi:** `Authorization: Bearer <jwt_token>`
- **Format Pertukaran Data:** `Content-Type: application/json`

### Format Standar Response JSON (Envelope Pattern)
Semua response API mengadopsi standar envelope yang konsisten:

```json
{
  "success": true,
  "status": "success",
  "message": "Deskripsi hasil operasi",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 24,
    "total_pages": 3
  },
  "meta": {
    "timestamp": "2026-10-04T06:30:00.000Z"
  }
}
```

Format respons error:
```json
{
  "success": false,
  "status": "error",
  "message": "Pesan kesalahan atau validasi gagal",
  "error_code": "RESOURCE_NOT_FOUND",
  "meta": {
    "timestamp": "2026-10-04T06:30:00.000Z"
  }
}
```

---

## 2. Matriks Hak Akses & Peran (Role-Based Access Control)

| Modul | Endpoint | Method | Akses / Role | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Public | Registrasi akun baru (`job_seeker` / `recruiter`) |
| **Auth** | `/api/auth/login` | `POST` | Public | Login dan penerbitan JWT token |
| **Auth** | `/api/auth/me` | `GET` | All Authenticated | Mengambil profil user yang sedang login |
| **Jobs** | `/api/jobs` | `GET` | Public | Katalog lowongan aktif (filter, search, pagination) |
| **Jobs** | `/api/jobs/:id` | `GET` | Public | Detail lengkap satu lowongan pekerjaan |
| **Jobs** | `/api/jobs/mine` | `GET` | `recruiter` | Daftar lowongan milik recruiter yang sedang login |
| **Jobs** | `/api/jobs` | `POST` | `recruiter` | Mempublikasikan lowongan pekerjaan baru |
| **Jobs** | `/api/jobs/:id` | `PUT` | `recruiter` (Owner) | Mengubah lowongan pekerjaan (khusus pembuat job) |
| **Jobs** | `/api/jobs/:id` | `DELETE` | `recruiter` (Owner) | Menghapus lowongan pekerjaan (khusus pembuat job) |
| **Applications** | `/api/jobs/:id/apply` | `POST` | `job_seeker` | Mengajukan lamaran pada lowongan pekerjaan tertentu |
| **Applications** | `/api/applications/mine`| `GET` | `job_seeker` | Riwayat lamaran pekerjaan milik user login |
| **Applications** | `/api/jobs/:id/applicants` | `GET` | `recruiter` (Owner) | Daftar pelamar untuk lowongan tertentu |
| **Applications** | `/api/applications/:id` | `PUT` | `recruiter` (Owner) | Update status lamaran (`pending`, `reviewed`, `rejected`) |
| **Applications** | `/api/applications/dashboard` | `GET` | `recruiter` | Ringkasan metrik dashboard (total jobs, total pelamar, status) |

---

## 3. Spesifikasi Lengkap Endpoint

### A. Modul Authentication

#### 1. Registrasi Pengguna Baru
- **Endpoint:** `POST /api/auth/register`
- **Akses:** Public
- **Request Body:**
  ```json
  {
    "name": "Kandidat Baru",
    "email": "kandidat@example.com",
    "password": "password123",
    "role": "job_seeker"
  }
  ```
  *(Role yang diperbolehkan: `"job_seeker"` atau `"recruiter"`)*
- **Response Success (201 Created):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Registrasi pengguna berhasil!",
    "data": {
      "user": {
        "id": 5,
        "name": "Kandidat Baru",
        "email": "kandidat@example.com",
        "role": "job_seeker"
      }
    }
  }
  ```

#### 2. Login Pengguna
- **Endpoint:** `POST /api/auth/login`
- **Akses:** Public
- **Request Body:**
  ```json
  {
    "email": "budi@example.com",
    "password": "password123"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Login berhasil!",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "Budi Santoso",
        "email": "budi@example.com",
        "role": "job_seeker"
      }
    }
  }
  ```

#### 3. Cek Profil Saya
- **Endpoint:** `GET /api/auth/me`
- **Akses:** Bearer Token (Semua Role)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Data profil pengguna berhasil dimuat.",
    "data": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "job_seeker"
    }
  }
  ```

---

### B. Modul Jobs (Lowongan Pekerjaan)

#### 1. Mendapatkan Katalog Lowongan Aktif
- **Endpoint:** `GET /api/jobs`
- **Akses:** Public
- **Query Parameters:**
  - `page` (number, default: `1`): Nomor halaman
  - `limit` (number, default: `10`): Jumlah data per halaman
  - `keyword` (string, opsional): Pencarian judul lowongan atau nama perusahaan (support real-time debounce 300ms)
  - `type` (string, opsional): Filter tipe pekerjaan (`full-time`, `part-time`, `contract`, `internship`)
  - `location` (string, opsional): Filter lokasi kota (contoh: `Jakarta`, `Bandung`, `Remote`)
  - `sort` (string, opsional): Pengurutan (`newest` = terbaru, `applicants` = pelamar terbanyak)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Daftar lowongan pekerjaan berhasil diambil",
    "data": {
      "jobs": [
        {
          "id": 1,
          "title": "Principal Spatial Systems Engineer",
          "company": "Aura Studios",
          "location": "Remote",
          "type": "full-time",
          "salary_min": 28000000,
          "salary_max": 45000000,
          "total_applicants": 4,
          "created_at": "2026-10-01T08:00:00.000Z"
        }
      ]
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_items": 1,
      "total_pages": 1
    }
  }
  ```

#### 2. Detail Satu Lowongan
- **Endpoint:** `GET /api/jobs/:id`
- **Akses:** Public
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Detail lowongan berhasil diambil",
    "data": {
      "id": 1,
      "title": "Principal Spatial Systems Engineer",
      "company": "Aura Studios",
      "location": "Remote",
      "type": "full-time",
      "description": "Deskripsi pekerjaan lengkap...",
      "requirements": "Daftar persyaratan kandidat...",
      "salary_min": 28000000,
      "salary_max": 45000000,
      "recruiter_id": 4,
      "recruiter_name": "recruiters",
      "recruiter_email": "recruiters@example.com",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  }
  ```

#### 3. Lowongan Milik Recruiter
- **Endpoint:** `GET /api/jobs/mine`
- **Akses:** Bearer Token (Role: `recruiter`)
- **Query Parameters:** `page`, `limit`
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Daftar lowongan milik recruiter berhasil diambil",
    "data": {
      "jobs": [
        {
          "id": 1,
          "title": "Principal Spatial Systems Engineer",
          "company": "Aura Studios",
          "total_applicants": 4,
          "is_active": 1
        }
      ]
    }
  }
  ```

#### 4. Posting Lowongan Baru
- **Endpoint:** `POST /api/jobs`
- **Akses:** Bearer Token (Role: `recruiter`)
- **Request Body:**
  ```json
  {
    "title": "Principal Spatial Systems Engineer",
    "company": "Aura Studios",
    "location": "Remote",
    "type": "full-time",
    "description": "Memimpin arsitektur sistem grafika 3D dan spatial rendering...",
    "requirements": "- 5+ tahun pengalaman C++ / Rust\n- Pemahaman Metal / Vulkan",
    "salary_min": 28000000,
    "salary_max": 45000000
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Lowongan berhasil diposting",
    "data": {
      "id": 9,
      "title": "Principal Spatial Systems Engineer",
      "company": "Aura Studios"
    }
  }
  ```

#### 5. Update Lowongan (Hanya Milik Sendiri)
- **Endpoint:** `PUT /api/jobs/:id`
- **Akses:** Bearer Token (Role: `recruiter` - Pemilik Lowongan)
- **Request Body:** Field yang ingin diubah (contoh: `title`, `salary_max`, `is_active`)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Lowongan berhasil diperbarui",
    "data": {
      "id": 1,
      "title": "Principal Spatial Systems Engineer (Updated)"
    }
  }
  ```
- **Response Error (403 Forbidden):** Jika recruiter lain mencoba mengubah job yang bukan miliknya.

#### 6. Hapus Lowongan (Hanya Milik Sendiri)
- **Endpoint:** `DELETE /api/jobs/:id`
- **Akses:** Bearer Token (Role: `recruiter` - Pemilik Lowongan)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Lowongan berhasil dihapus"
  }
  ```

---

### C. Modul Application Tracking (Riwayat & Pelacakan Lamaran)

#### 1. Mengajukan Lamaran Kerja
- **Endpoint:** `POST /api/jobs/:id/apply`
- **Akses:** Bearer Token (Role: `job_seeker`)
- **Headers:** `Authorization: Bearer <seeker_token>`
- **Request Body:**
  ```json
  {
    "cover_letter": "Saya sangat tertarik melamar posisi ini karena memiliki keahlian dan portofolio yang relevan dengan kebutuhan tim."
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Lamaran berhasil dikirim",
    "data": {
      "id": 12,
      "job_id": 1,
      "user_id": 1,
      "status": "pending",
      "applied_at": "2026-10-04T06:30:00.000Z"
    }
  }
  ```
- **Validasi Bisnis:**
  - `400 Bad Request`: Jika user sudah pernah melamar posisi tersebut sebelumnya (*"Anda sudah melamar pekerjaan ini sebelumnya"*).
  - `403 Forbidden`: Jika pengguna berkedudukan sebagai recruiter mencoba melamar (*"Hanya job_seeker yang dapat mengakses fitur ini"*).

#### 2. Riwayat Lamaran Saya
- **Endpoint:** `GET /api/applications/mine`
- **Akses:** Bearer Token (Role: `job_seeker`)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Riwayat lamaran berhasil diambil",
    "data": [
      {
        "id": 1,
        "job_id": 1,
        "title": "Principal Spatial Systems Engineer",
        "company": "Aura Studios",
        "location": "Remote",
        "type": "full-time",
        "status": "reviewed",
        "cover_letter": "Saya sangat tertarik...",
        "applied_at": "2026-10-02T10:15:00.000Z"
      }
    ]
  }
  ```

#### 3. Daftar Pelamar untuk Job Tertentu
- **Endpoint:** `GET /api/jobs/:id/applicants`
- **Akses:** Bearer Token (Role: `recruiter` - Pemilik Lowongan)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Daftar pelamar berhasil diambil",
    "data": [
      {
        "id": 1,
        "application_id": 1,
        "user_id": 1,
        "applicant_name": "Budi Santoso",
        "applicant_email": "budi@example.com",
        "cover_letter": "Saya sangat tertarik melamar...",
        "status": "reviewed",
        "applied_at": "2026-10-02T10:15:00.000Z"
      }
    ]
  }
  ```
- **Proteksi Kepemilikan (Ownership):** Jika recruiter yang meminta bukan pemilik dari job tersebut, sistem mengembalikan `403 Forbidden`.

#### 4. Update Status Lamaran
- **Endpoint:** `PUT /api/applications/:id`
- **Akses:** Bearer Token (Role: `recruiter` - Pemilik Lowongan)
- **Request Body:**
  ```json
  {
    "status": "reviewed"
  }
  ```
  *(Status yang valid: `"pending"`, `"reviewed"`, `"rejected"`)*
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Status lamaran berhasil diperbarui menjadi 'reviewed'",
    "data": {
      "id": 1,
      "status": "reviewed",
      "updated_at": "2026-10-04T06:35:00.000Z"
    }
  }
  ```

#### 5. Ringkasan Dashboard Recruiter
- **Endpoint:** `GET /api/applications/dashboard`
- **Akses:** Bearer Token (Role: `recruiter`)
- **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Data dashboard recruiter berhasil diambil",
    "data": {
      "total_jobs_posted": 9,
      "total_applicants": 6,
      "status_breakdown": {
        "pending": 3,
        "reviewed": 1,
        "rejected": 2
      },
      "pending_count": 3,
      "reviewed_count": 1,
      "rejected_count": 2
    }
  }
  ```

---

## 4. Panduan Penggunaan Collection Postman

File collection Postman tersedia pada root repository:
📁 **`Applications_API.postman_collection.json`**

### Langkah Import ke Postman:
1. Buka aplikasi **Postman**.
2. Klik tombol **Import** di kiri atas.
3. Seret (drag & drop) atau pilih file `Applications_API.postman_collection.json`.
4. Collection **JobHunt - Feature Application Tracking & Jobs API** akan muncul di sidebar.

### Variabel Collection (Auto-Configured):
Collection ini sudah dilengkapi variabel bawaan:
- `base_url`: `http://localhost:5000`
- `job_id`: `1` (ID lowongan contoh)
- `application_id`: `1` (ID lamaran contoh)
- `seeker_token`: Pre-configured JWT token aktif untuk akun Job Seeker (`budi@example.com`)
- `recruiter_token`: Pre-configured JWT token aktif untuk akun Recruiter (`recruiters@example.com`)

### Fitur Otomatis (Auto-Save Token):
Setiap kali Anda mengeksekusi request **Login Job Seeker** atau **Login Recruiter**, script pengujian (Tests) di Postman akan secara otomatis mengupdate nilai `seeker_token` dan `recruiter_token` ke dalam variabel collection, sehingga Anda tidak perlu menyalin token secara manual.
