# 🍱 Food Waste Marketplace — API Integration (Fitur Lanjutan)

Dokumentasi 5 flow integrasi baru antara backend Express.js dan frontend Next.js.

---

## 📁 Struktur File

```
fw-integration/
├── backend/
│   ├── server-full.js              ← Entry point utama (ganti server.js lama)
│   ├── package.json                ← Dependencies backend
│   ├── schema-extension.sql        ← Skema tabel baru (jalankan ke MySQL)
│   ├── middleware/
│   │   └── auth.js                 ← JWT middleware (reusable)
│   ├── routes/
│   │   ├── authRoutes.js           ← Register + Login
│   │   ├── passwordRoutes.js       ← Reset Password flow
│   │   ├── productRoutes.js        ← CRUD produk + auto-disable + status Habis
│   │   ├── checkoutRoutes.js       ← Checkout < 2 menit
│   │   └── orderRoutes.js          ← Pesanan Selesai + trigger poin
│   ├── services/
│   │   └── fcmService.js           ← Firebase push notification
│   └── jobs/
│       └── scheduledJobs.js        ← Cron: auto-expire + reminder harian
│
├── src/
│   ├── api/
│   │   └── index.js               ← Semua API service functions (untuk React)
│   └── hooks/
│       └── index.js               ← Custom hooks siap pakai
│
└── .env.example                   ← Template environment variables
```

---

## 🚀 Setup

### Backend
```bash
cd backend
npm install
cp ../.env.example .env   # Isi semua variabel

# Setup database
mysql -u root -p food_waste_db < schema-extension.sql

# Letakkan Firebase service account key
mkdir config
# Download dari Firebase Console → Project Settings → Service Accounts
# Simpan sebagai: config/serviceAccountKey.json

npm run dev   # development
npm start     # production
```

### Frontend
```bash
npm install axios firebase

# Copy folder src/ ke project Next.js Anda
cp -r src/api   your-nextjs/src/api
cp -r src/hooks your-nextjs/src/hooks

# Isi .env.local dengan variabel Firebase & API URL
```

---

## 🔌 API Endpoints

### 🔑 Reset Password

| Method | Endpoint                        | Auth | Deskripsi                     |
|--------|---------------------------------|------|-------------------------------|
| POST   | /api/password/request-reset     | ❌   | Kirim link reset ke email     |
| POST   | /api/password/verify-token      | ❌   | Cek apakah token masih valid  |
| POST   | /api/password/reset             | ❌   | Set password baru             |

### 🛒 Produk & Stok

| Method | Endpoint                        | Auth | Deskripsi                                    |
|--------|---------------------------------|------|----------------------------------------------|
| GET    | /api/products                   | ❌   | Daftar produk (filter: restaurant_id, status)|
| GET    | /api/products/:id/stock         | ❌   | Stok real-time + flag `can_buy`              |
| POST   | /api/products                   | ✅   | Tambah produk (restoran)                     |
| PUT    | /api/products/:id               | ✅   | Update stok → auto status Habis/Available    |
| PATCH  | /api/products/:id/restock       | ✅   | Isi ulang stok                               |

### 💳 Checkout (< 2 Menit)

| Method | Endpoint                        | Auth | Deskripsi                              |
|--------|---------------------------------|------|----------------------------------------|
| POST   | /api/checkout/initiate          | ✅   | Buat order, lock stok, mulai timer 2 menit |
| POST   | /api/checkout/confirm           | ❌   | Callback dari payment gateway          |
| POST   | /api/checkout/cancel            | ✅   | Batalkan order (sebelum deadline)      |
| GET    | /api/checkout/status/:id        | ✅   | Status order + sisa detik              |

### 📦 Pesanan & Poin

| Method | Endpoint                        | Auth | Deskripsi                              |
|--------|---------------------------------|------|----------------------------------------|
| POST   | /api/orders/:id/selesai         | ✅   | Tandai selesai → otomatis tambah poin  |
| GET    | /api/orders/my                  | ✅   | Riwayat pesanan pembeli                |
| GET    | /api/orders/incoming            | ✅   | Pesanan masuk (restoran)               |
| GET    | /api/orders/points              | ✅   | Total poin + riwayat transaksi poin    |

### 🔔 Notifikasi

| Method | Endpoint                              | Auth | Deskripsi                  |
|--------|---------------------------------------|------|----------------------------|
| POST   | /api/notifications/register-token    | ✅   | Simpan FCM token device    |
| DELETE | /api/notifications/unregister-token  | ✅   | Hapus FCM token (logout)   |

---

## 💡 Contoh Penggunaan di React/Next.js

### Flow Reset Password
```jsx
import { usePasswordReset } from '@/hooks';

export default function ResetPasswordPage() {
  const { step, loading, error, requestReset, verifyToken, doReset } = usePasswordReset();

  // Step 1: form email
  if (step === 'request') return (
    <form onSubmit={e => { e.preventDefault(); requestReset(email); }}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" disabled={loading}>Kirim Link Reset</button>
    </form>
  );

  // Step 2: (opsional) verifikasi token dari URL
  // Step 3: form password baru
  if (step === 'reset') return (
    <form onSubmit={e => { e.preventDefault(); doReset(tokenFromUrl, newPassword); }}>
      <input type="password" onChange={e => setNewPassword(e.target.value)} />
      <button type="submit">Simpan Password Baru</button>
    </form>
  );

  if (step === 'done') return <p>✅ Password berhasil direset!</p>;
}
```

### Auto-disable Tombol "Beli"
```jsx
import { useProductStock } from '@/hooks';

export default function ProductCard({ productId }) {
  const { stock, canBuy, loading } = useProductStock(productId);
  // canBuy di-polling setiap 10 detik → otomatis sync dengan server

  return (
    <div>
      <p>Stok: {stock}</p>
      <button disabled={!canBuy || loading}>
        {canBuy ? 'Beli Sekarang' : 'Stok Habis'}
      </button>
    </div>
  );
}
```

### Countdown Checkout 2 Menit
```jsx
import { useCheckout } from '@/hooks';

export default function CheckoutPage() {
  const {
    startCheckout, cancel,
    timeDisplay, secondsLeft,
    orderStatus, isPaid, isExpired,
    loading, error
  } = useCheckout();

  const handleCheckout = async () => {
    await startCheckout([{ product_id: 1, quantity: 2 }]);
  };

  return (
    <div>
      {orderStatus === 'pending' && (
        <div style={{ color: secondsLeft < 30 ? 'red' : 'black' }}>
          ⏱ Selesaikan pembayaran: <strong>{timeDisplay}</strong>
          <button onClick={cancel}>Batalkan</button>
        </div>
      )}
      {isPaid    && <p>✅ Pembayaran berhasil!</p>}
      {isExpired && <p>❌ Pesanan kedaluwarsa. Silakan coba lagi.</p>}
      <button onClick={handleCheckout} disabled={loading}>Pesan Sekarang</button>
    </div>
  );
}
```

### Pesanan Selesai + Poin
```jsx
import { useOrders, usePoints } from '@/hooks';

// Komponen restoran
export default function RestaurantOrders() {
  const { orders, markAsSelesai } = useOrders('restaurant');

  const handleSelesai = async (orderId) => {
    const result = await markAsSelesai(orderId);
    alert(`Pesanan selesai! Pembeli mendapat +${result.points_added} poin`);
  };

  return orders.map(order => (
    <div key={order.id}>
      Order #{order.id} — {order.status}
      {order.status === 'paid' && (
        <button onClick={() => handleSelesai(order.id)}>Tandai Selesai</button>
      )}
    </div>
  ));
}

// Komponen poin pembeli
export default function PointsBadge() {
  const { totalPoints } = usePoints();
  return <span>🏆 {totalPoints} Poin</span>;
}
```

---

## 🔔 Setup Firebase Push Notification

### 1. Backend
```bash
# Download dari Firebase Console:
# Project Settings → Service Accounts → Generate new private key
# Simpan sebagai backend/config/serviceAccountKey.json
```

### 2. Frontend (Next.js)
```js
// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const app = initializeApp({
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
```

```jsx
// _app.js atau layout.js
import { messaging } from '@/lib/firebase';
import { useFcmNotification } from '@/hooks';

export default function App({ Component, pageProps }) {
  useFcmNotification(messaging); // setup FCM + minta izin notifikasi
  return <Component {...pageProps} />;
}
```

### 3. Service Worker (wajib untuk background notification)
```js
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'your_api_key',
  projectId:         'your_project_id',
  messagingSenderId: 'your_sender_id',
  appId:             'your_app_id',
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    { body: payload.notification.body, icon: '/icon.png' }
  );
});
```

---

## ⏱ Cron Jobs

| Job                  | Jadwal          | Fungsi                                              |
|----------------------|-----------------|-----------------------------------------------------|
| Auto-expire orders   | Setiap 30 detik | Expire order pending yang > 2 menit, kembalikan stok|
| Daily reminder       | Setiap hari 08:00 WIB | Push notif stok hampir habis ke pembeli aktif |
| New products alert   | Setiap hari 10:00 WIB | Push notif produk baru dari restoran          |

---

## 🔐 Konfigurasi Poin

Edit di `backend/routes/orderRoutes.js`:
```js
const POINTS_PER_ORDER = 10;   // poin dasar per pesanan selesai
const POINTS_PER_10K   = 1;    // bonus 1 poin per Rp10.000 belanja
```
