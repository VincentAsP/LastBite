// backend/routes/passwordRoutes.js
// Flow reset password:
//   1. POST /api/password/request-reset  → kirim OTP/token via email
//   2. POST /api/password/verify-token   → validasi token
//   3. POST /api/password/reset          → set password baru

const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const nodemailer = require('nodemailer');

// ---- Email transporter (gunakan SMTP atau layanan seperti SendGrid) ----
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   process.env.SMTP_PORT   || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ---- Helper: kirim email reset password ----
const sendResetEmail = async (toEmail, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from:    `"Food Waste App" <${process.env.SMTP_USER}>`,
    to:      toEmail,
    subject: 'Reset Password Akun Anda',
    html: `
      <h2>Reset Password</h2>
      <p>Klik link berikut untuk reset password Anda (berlaku <strong>15 menit</strong>):</p>
      <a href="${resetLink}" style="
        display:inline-block;padding:12px 24px;
        background:#e74c3c;color:#fff;border-radius:6px;text-decoration:none;
      ">Reset Password</a>
      <p style="color:#888;font-size:12px;margin-top:16px;">
        Jika Anda tidak meminta reset password, abaikan email ini.
      </p>
    `,
  });
};

// ============================================================
//  1. REQUEST RESET — kirim token ke email
// ============================================================
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email wajib diisi.' });

  const pool = req.app.locals.pool;
  try {
    // Cari user berdasarkan email
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );

    // Selalu kembalikan 200 agar tidak bocorkan info akun mana yang terdaftar
    if (users.length === 0) {
      return res.json({ message: 'Jika email terdaftar, link reset telah dikirim.' });
    }

    const userId = users[0].id;

    // Hapus token lama yang belum dipakai untuk user ini
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE user_id = ? AND used = 0', [userId]
    );

    // Buat token acak 32 byte (64 karakter hex)
    const token     = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );

    await sendResetEmail(email, token);

    res.json({ message: 'Jika email terdaftar, link reset telah dikirim.' });
  } catch (error) {
    console.error('[password/request-reset]', error);
    res.status(500).json({ message: 'Gagal mengirim email reset.' });
  }
});

// ============================================================
//  2. VERIFY TOKEN — cek apakah token valid (untuk frontend)
// ============================================================
router.post('/verify-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token wajib diisi.' });

  const pool = req.app.locals.pool;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE token = ? AND used = 0 AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ valid: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    res.json({ valid: true, message: 'Token valid.' });
  } catch (error) {
    console.error('[password/verify-token]', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ============================================================
//  3. RESET PASSWORD — set password baru
// ============================================================
router.post('/reset', async (req, res) => {
  const { token, new_password } = req.body;
  if (!token || !new_password) {
    return res.status(400).json({ message: 'Token dan password baru wajib diisi.' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter.' });
  }

  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ambil token yang masih valid
    const [rows] = await conn.query(
      `SELECT * FROM password_reset_tokens
       WHERE token = ? AND used = 0 AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    const { user_id, id: tokenId } = rows[0];

    // Update password user (untuk production: hash dengan bcrypt)
    await conn.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [new_password, user_id]
    );

    // Tandai token sebagai sudah dipakai
    await conn.query(
      'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
      [tokenId]
    );

    await conn.commit();
    res.json({ message: 'Password berhasil direset. Silakan login.' });
  } catch (error) {
    await conn.rollback();
    console.error('[password/reset]', error);
    res.status(500).json({ message: 'Gagal reset password.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
