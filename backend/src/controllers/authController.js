// Akun Admin
// Email: admin@lastbite.com
// Password: admin123

const bcrypt = require('bcrypt');
const pool = require('../config/db');
const sendVerificationEmail = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const validate_email = require('deep-email-validator')

async function registerUser(req, res) {
    try {
        const { full_name, birth_date, email, password, roleID, address } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sqlQuery = 'INSERT INTO user (full_name, birth_date, email, password, roleID, address, status) VALUES (?, ?, ?, ?, 1, ?, "inactive")';
        
        await pool.query(sqlQuery, [full_name, birth_date, email, hashedPassword, address]);
        
        // OTP Email
        const otpRandom = Math.floor(1000 + Math.random() * 9000); 
        sendVerificationEmail(email, otpRandom); 
        
        return res.status(201).json({ message: "Registrasi Sukses & Email Verifikasi Terkirim!" });

    } catch (error) {
        console.error("Error saat register:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }
        
        return res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email dan password wajib diisi!' });

    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

    if (users.length === 0)
      return res.status(401).json({ message: 'Email atau password salah!' });

    const user = users[0];

    if (user.status === 'deleted')
      return res.status(405).json({ message: 'Akun tidak ditemukan.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: 'Email atau password salah!' });

    // Belum verifikasi → kirim OTP, tolak login
    if (user.status === 'inactive') {
      const otpRandom = Math.floor(1000 + Math.random() * 9000);
      await pool.query('UPDATE user SET otp = ? WHERE email = ?', [otpRandom, email]);
      sendVerificationEmail(email, otpRandom);
      return res.status(403).json({ message: 'Email belum diverifikasi. Kode OTP telah dikirim.' });
    }

    // Login sukses
    const token = jwt.sign(
      { id: user.userID, full_name: user.full_name, role: user.roleID },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login berhasil!',
      user: { userID: user.userID, full_name: user.full_name, roleID: user.roleID, email: user.email, phone: user.phone, address: user.address, },
      token,
      redirectTo: user.roleID === 3 ? '/admin-panel' : '/dashboard',
    });

  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server saat login' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan.' });

    const user = users[0];

    if (String(user.otp) !== String(otp))
      return res.status(400).json({ message: 'Kode OTP salah atau sudah kedaluwarsa.' });

    // Aktifkan akun + hapus OTP
    await pool.query('UPDATE user SET status = "active", otp = NULL WHERE email = ?', [email]);

    const token = jwt.sign(
      { id: user.userID, full_name: user.full_name, role: user.roleID },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Verifikasi berhasil!',
      user: { userID: user.userID, full_name: user.full_name, roleID: user.roleID },
      token,
    });
  } catch (error) {
    console.error('Error verify OTP:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan.' });

    if (users[0].status === 'active')
      return res.status(400).json({ message: 'Akun sudah aktif.' });

    const otpRandom = Math.floor(1000 + Math.random() * 9000);
    await pool.query('UPDATE user SET otp = ? WHERE email = ?', [otpRandom, email]);
    sendVerificationEmail(email, otpRandom);

    return res.status(200).json({ message: 'OTP berhasil dikirim ulang.' });
  } catch (error) {
    console.error('Error resend OTP:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email wajib diisi.' });

    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(404).json({ message: 'Email tidak terdaftar.' });

    if (users[0].status === 'deleted')
      return res.status(404).json({ message: 'Email tidak terdaftar.' });

    const otp = Math.floor(1000 + Math.random() * 9000);
    await pool.query('UPDATE user SET otp = ? WHERE email = ?', [otp, email]);
    sendVerificationEmail(email, otp);

    return res.status(200).json({ message: 'Kode OTP telah dikirim.' });
  } catch (error) {
    console.error('[forgotPassword]', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;

    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan.' });

    if (String(users[0].otp) !== String(otp))
      return res.status(400).json({ message: 'Kode OTP salah atau kedaluwarsa.' });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query(
      'UPDATE user SET password = ?, otp = NULL WHERE email = ?',
      [hashed, email]
    );

    return res.status(200).json({ message: 'Password berhasil direset.' });
  } catch (error) {
    console.error('[resetPassword]', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};



module.exports = { registerUser, login, verifyOtp, resendOtp, forgotPassword, resetPassword };