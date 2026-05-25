const bcrypt = require('bcrypt');
const pool = require('../config/db'); 
const sendVerificationEmail = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const validate_email = require('deep-email-validator')

async function registerUser(req, res) {
    try {
        // 1. Ambil data dari req.body (Gunakan username, bukan name)
        const { username, email, birth_date, password } = req.body;

        // 2. Validasi input (Pastikan nama variabelnya sesuai)
        if (!username || !email || !password || !birth_date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ message: "Format email tidak valid!" });
        }

        const emailValidation = await validate_email.validate(email);
           if (!emailValidation.valid) {
               return res.status(400).json({ 
                   message: "Email tidak valid atau tidak aktif! Gunakan email asli." 
               });
           }

        // 3. Hash Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. SQL Query (roleID langsung di-hardcode 1 di dalam query string)
        const sqlQuery = 'INSERT INTO user (username, email, password, roleID, birth_date) VALUES (?, ?, ?, 1, ?)';
        
        // 5. Eksekusi query dengan array parameter yang urutannya pas
        // birth_date dimasukkan sebagai string 'YYYY-MM-DD' langsung aman ke XAMPP MySQL
        await pool.query(sqlQuery, [username, email, hashedPassword, birth_date]);
        
        // 6. OTP & Email Verification
        const otpRandom = Math.floor(1000 + Math.random() * 9000); 
        sendVerificationEmail(email, otpRandom); 
        
        return res.status(201).json({ message: "Registrasi Sukses!" });

    } catch (error) {
        console.error("Error Registrasi:", error);
        
        // Menangkap error jika email/username duplikat di MySQL XAMPP
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email atau Username sudah terdaftar!" });
        }
        
        return res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email dan password wajib diisi!' });
    }

    try {
        
        const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        // Generate JWT Token (Menggunakan kolom userID dan roleID sesuai struktur database kamu)
        const token = jwt.sign(
            { id: user.userID, username: user.username, role: user.roleID },
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '1h' }
        );

        return res.json({ message: 'Login berhasil!', token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server saat login' });
    }
};

module.exports = { registerUser, login };