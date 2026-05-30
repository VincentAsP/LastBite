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

        const sqlQuery = 'INSERT INTO user (full_name, birth_date, email, password, roleID, address) VALUES (?, ?, ?, ?, ?, ?)';
        
        await pool.query(sqlQuery, [full_name, birth_date, email, hashedPassword, roleID, address]);
        
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

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi!' });
        }

        // Ambil data user dari database
        const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        if (users[0].status === 'deleted') {
            return res.status(403).json({ message: 'Akun tidak ditemukan.' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        // Generate JWT Token (Menggunakan kolom userID dan roleID sesuai struktur database kamu)
        const token = jwt.sign(
            { id: user.userID, full_name: user.full_name, role: user.roleID },
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '1h' }
        );

        let redirectTarget = '/dashboard'; // Direct default untuk Buyer & Seller
        
        if (user.roleID === 3) {
            redirectTarget = '/admin-panel'; // Direct khusus untuk Admin
        }

        return res.status(200).json({ 
            message: 'Login berhasil!', 
            token: token,
            redirectTo: redirectTarget 
        });

    } catch (error) {
        console.error("Error saat login:", error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server saat login' });
    }
};

module.exports = { registerUser, login };