# 🍱 Food Waste App — API Integration Layer

Dokumentasi lengkap integrasi antara **Backend (Express.js)** dan **Frontend (Next.js/React)**.

---

## 📁 Struktur File

```
food-waste-api/
├── backend/
│   ├── server.js          ← Backend Express (auth + food items + reports + HTTPS)
│   ├── schema.sql         ← Skema database MySQL
│   └── generate-ssl.sh    ← Script buat SSL certificate
│
├── src/
│   ├── api/
│   │   ├── apiClient.js   ← Axios base instance + JWT interceptor
│   │   ├── authApi.js     ← Register, Login, Logout
│   │   ├── foodItemsApi.js← CRUD food items
│   │   └── reportsApi.js  ← Laporan & statistik
│   │
│   └── hooks/
│       └── hooks.js       ← useAuth, useFoodItems, useReports
│
└── .env.example           ← Template environment variables
```

---

## 🚀 Setup & Instalasi

### 1. Backend

```bash
cd backend

# Install dependencies
npm install express cors jsonwebtoken mysql2 dotenv

# Salin dan isi environment variables
cp ../.env.example .env

# Setup database (jalankan schema.sql di MySQL)
mysql -u root -p food_waste_db < schema.sql

# (Opsional) Generate SSL untuk HTTPS
bash generate-ssl.sh

# Jalankan server
node server.js
```

### 2. Frontend (Next.js)

```bash
# Install axios
npm install axios

# Salin file ke project Next.js Anda
cp -r src/api   your-nextjs-project/src/api
cp -r src/hooks your-nextjs-project/src/hooks

# Tambah .env.local di root Next.js
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" >> .env.local
```

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint       | Body                          | Auth | Deskripsi          |
|--------|----------------|-------------------------------|------|--------------------|
| POST   | /api/register  | `{ username, password }`      | ❌   | Daftar akun baru   |
| POST   | /api/login     | `{ username, password }`      | ❌   | Login & dapat token|

### Food Items

| Method | Endpoint              | Body / Params          | Auth | Deskripsi            |
|--------|-----------------------|------------------------|------|----------------------|
| GET    | /api/food-items       | —                      | ✅   | Semua item milik user|
| POST   | /api/food-items       | `{ name, expiry_date, ...}` | ✅ | Tambah item baru  |
| PUT    | /api/food-items/:id   | field yang diubah      | ✅   | Update item          |
| DELETE | /api/food-items/:id   | —                      | ✅   | Hapus item           |

### Laporan

| Method | Endpoint                    | Auth | Deskripsi                    |
|--------|-----------------------------|------|------------------------------|
| GET    | /api/reports/summary        | ✅   | Total, wasted, expired, donated |
| GET    | /api/reports/by-category    | ✅   | Waste per kategori (chart)   |
| GET    | /api/reports/monthly-trend  | ✅   | Tren waste per bulan         |

---

## 💡 Contoh Penggunaan di React/Next.js

### Login
```jsx
import { useAuth } from '@/hooks/hooks';

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username: 'john', password: 'secret' });
    // Redirect otomatis setelah login
  };
}
```

### Tampil & Tambah Food Item
```jsx
import { useFoodItems } from '@/hooks/hooks';

export default function FoodList() {
  const { items, expiredItems, addItem, wasteItem } = useFoodItems();

  const handleAdd = () => addItem({
    name: 'Bayam',
    category: 'Sayuran',
    quantity: 2,
    unit: 'ikat',
    expiry_date: '2025-06-01',
  });

  return (
    <div>
      <p>⚠️ {expiredItems.length} item sudah expired!</p>
      {items.map(item => (
        <div key={item.id}>
          {item.name} — {item.expiry_date}
          <button onClick={() => wasteItem(item.id)}>Tandai Wasted</button>
        </div>
      ))}
    </div>
  );
}
```

### Dashboard Statistik
```jsx
import { useReports } from '@/hooks/hooks';

export default function Dashboard() {
  const { summary, loading } = useReports();

  if (loading) return <p>Memuat data...</p>;

  return (
    <div>
      <p>Total Item: {summary?.total_items}</p>
      <p>Waste Rate: {summary?.waste_rate}%</p>
      <p>Expired:   {summary?.expired_items}</p>
    </div>
  );
}
```

---

## 🔒 HTTPS / SSL

### Development (self-signed)
```bash
bash backend/generate-ssl.sh
# Lalu isi .env:
# SSL_KEY_PATH=./ssl/key.pem
# SSL_CERT_PATH=./ssl/cert.pem
```
Server akan berjalan di **port 5000 (HTTP)** dan **port 5443 (HTTPS)** secara bersamaan.

### Production (Let's Encrypt)
```bash
sudo certbot certonly --standalone -d yourdomain.com
# Lalu isi .env:
# SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
# SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

---

## 🔐 Keamanan

- **JWT** dipakai untuk autentikasi, token expire dalam **1 jam**
- Token disimpan di `localStorage` dan dikirim via header `Authorization: Bearer <token>`
- Jika token expired, user **otomatis di-redirect ke halaman login**
- **CORS** dikonfigurasi hanya untuk origin frontend yang terdaftar
- Setiap endpoint protected hanya bisa diakses dengan token valid
