const db = require('../config/db');

async function changeUserRole(req, res) {
    try {
        const { userID, targetRoleID } = req.body;

        if (!userID || !targetRoleID) {
            return res.status(400).json({ message: "userID dan targetRoleID wajib diisi!" });
        }

        // Whitelist Validation (CUMA BOLEH angka 1 (buyer) atau 2 (seller))
        if (![1, 2].includes(Number(targetRoleID))) {
            return res.status(403).json({ message: "Akses ilegal! Peran tidak dikenal sistem." });
        }

        const sqlQuery = 'UPDATE user SET roleID = ? WHERE userID = ?';
        
        db.query(sqlQuery, [targetRoleID, userID], (err, result) => {
            if (err) {
                console.error("Gagal ganti role:", err);
                return res.status(500).json({ message: "Gagal mengganti peran. Server error." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Akun tidak ditemukan!" });
            }

            const roleName = Number(targetRoleID) === 1 ? "Pembeli" : "Penjual";
            res.status(200).json({ 
                message: `Yey! Kamu berhasil pindah ke mode ${roleName}.`,
                currentRoleID: targetRoleID
            });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}

module.exports = { changeUserRole };