// backend/services/fcmService.js
// Service untuk kirim push notification via Firebase Cloud Messaging (FCM)
// Mendukung: notifikasi ke satu user, broadcast, dan notifikasi terjadwal

const admin = require('firebase-admin');
const path  = require('path');

// ---- Inisialisasi Firebase Admin SDK ----
// Letakkan file serviceAccountKey.json di backend/config/
if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.join(__dirname, '../config/serviceAccountKey.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized');
  } catch (err) {
    console.warn('⚠️  Firebase serviceAccountKey.json tidak ditemukan. Push notification dinonaktifkan.');
  }
}

// ---- Helper: ambil semua FCM token milik user ----
const getUserFcmTokens = async (pool, userId) => {
  const [rows] = await pool.query(
    'SELECT token FROM fcm_tokens WHERE user_id = ?', [userId]
  );
  return rows.map((r) => r.token);
};

// ---- Helper: hapus token yang sudah tidak valid ----
const pruneInvalidTokens = async (pool, userId, invalidTokens) => {
  if (invalidTokens.length === 0) return;
  for (const token of invalidTokens) {
    await pool.query(
      'DELETE FROM fcm_tokens WHERE user_id = ? AND token = ?', [userId, token]
    );
  }
};

// ============================================================
//  Kirim notifikasi ke satu user (bisa punya banyak device)
// ============================================================
const sendNotificationToUser = async (pool, userId, { title, body, data = {} }) => {
  if (!admin.apps.length) return; // Firebase tidak aktif

  const tokens = await getUserFcmTokens(pool, userId);
  if (tokens.length === 0) return;

  const message = {
    notification: { title, body },
    data:         { ...data },              // data harus string semua
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    // Bersihkan token yang tidak valid (unregistered device)
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const code = resp.error?.code;
        if (
          code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });
    await pruneInvalidTokens(pool, userId, invalidTokens);

    return response;
  } catch (err) {
    console.error('[FCM] sendNotificationToUser error:', err.message);
  }
};

// ============================================================
//  Kirim notifikasi ke banyak user sekaligus (broadcast)
//  Contoh: reminder stok hampir habis ke semua pembeli yang punya wishlist
// ============================================================
const broadcastNotification = async (pool, userIds, { title, body, data = {} }) => {
  if (!admin.apps.length) return;
  await Promise.allSettled(
    userIds.map((uid) => sendNotificationToUser(pool, uid, { title, body, data }))
  );
};

// ============================================================
//  Route: simpan/update FCM token dari device pembeli
//  POST /api/notifications/register-token
// ============================================================
const registerTokenRoute = (pool) => async (req, res) => {
  const { token, device } = req.body;
  if (!token) return res.status(400).json({ message: 'FCM token wajib diisi.' });

  try {
    await pool.query(
      `INSERT INTO fcm_tokens (user_id, token, device)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE device = VALUES(device)`,
      [req.user.id, token, device || 'unknown']
    );
    res.json({ message: 'FCM token terdaftar.' });
  } catch (err) {
    console.error('[FCM] registerToken error:', err);
    res.status(500).json({ message: 'Gagal mendaftar token.' });
  }
};

// ============================================================
//  Route: hapus FCM token (logout / ganti device)
//  DELETE /api/notifications/unregister-token
// ============================================================
const unregisterTokenRoute = (pool) => async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'FCM token wajib diisi.' });

  try {
    await pool.query(
      'DELETE FROM fcm_tokens WHERE user_id = ? AND token = ?',
      [req.user.id, token]
    );
    res.json({ message: 'FCM token dihapus.' });
  } catch (err) {
    console.error('[FCM] unregisterToken error:', err);
    res.status(500).json({ message: 'Gagal menghapus token.' });
  }
};

module.exports = {
  sendNotificationToUser,
  broadcastNotification,
  registerTokenRoute,
  unregisterTokenRoute,
};
