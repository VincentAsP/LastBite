const bcrypt = require('bcrypt');
const pool = require('../config/db'); 
const sendVerificationEmail = require('../utils/mailer');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    try {
        const { username, email, password, roleID, address } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sqlQuery = 'INSERT INTO user (username, email, password, roleID, address) VALUES (?, ?, ?, ?, ?)';
        
        //Modifikasi pakai await
        await pool.query(sqlQuery, [username, email, hashedPassword, roleID, address]);
        
        
        const otpRandom = Math.floor(1000 + Math.random() * 9000); // Bikin 4 angka acak
        sendVerificationEmail(email, otpRandom); // Kirim OTP ke email user
        
        res.status(201).json({ message: "Registrasi Sukses!" });

    } catch (error) {
        console.error("Error Registrasi:", error);
        
        // Bonus: Menangkap error jika email/username sudah ada di database (Duplicate Entry)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email atau Username sudah terdaftar!" });
        }
        
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
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
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        const token = jwt.sign(
            { id: user.userID, username: user.username, role: user.roleID },
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login berhasil!', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat login' });
    }
};

module.exports = { registerUser, login };