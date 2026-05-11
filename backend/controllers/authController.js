const bcrypt = require('bcrypt');
const db = require('../config/db'); 
const sendVerificationEmail = require('../utils/mailer');

async function registerUser(req, res) {
    try {
        const { username, email, password, roleID, address } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sqlQuery = 'INSERT INTO user (username, email, password, roleID, address) VALUES (?, ?, ?, ?, ?)';
        
        db.query(sqlQuery, [username, email, hashedPassword, roleID, address], (err, result) => {
            if (err) {
                console.error("Gagal menyimpan ke database:", err);
                return res.status(500).json({ message: "Gagal mendaftarkan akun. Coba lagi!" });
            }
            
            const otpRandom = Math.floor(1000 + Math.random() * 9000); // Bikin 4 angka acak
            sendVerificationEmail(email, otpRandom); // Kirim OTP ke email user
            
            res.status(201).json({ message: "Registrasi Sukses!" });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}

module.exports = { registerUser };