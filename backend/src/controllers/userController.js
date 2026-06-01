const db = require('../config/db');

async function changeUserRole(req, res) {
    try {
        const { userID, targetRoleID } = req.body;

        if (!userID || !targetRoleID) {
            return res.status(400).json({ message: "userID dan targetRoleID wajib diisi!" });
        }

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

const pool = require('../config/db');

async function deleteAccount(req, res) {
    const { userID } = req.params;

    if (!userID) return res.status(400).json({ message: "UserID tidak boleh kosong!" });

    try {
        const [userCheck] = await pool.query('SELECT userID, status FROM user WHERE userID = ?', [userID]);
        
        if (userCheck.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        if (userCheck[0].status === 'deleted') {
            return res.status(400).json({ message: "Akun ini sudah dihapus sebelumnya." });
        }

        await pool.query('UPDATE user SET status = "deleted" WHERE userID = ?', [userID]);
        await pool.query('UPDATE user SET email = CONCAT("deleted_", userID, "_", email) WHERE userID = ?', [userID]);

        res.status(200).json({ message: "Akun berhasil dihapus." });

    } catch (error) {
        console.error("Gagal menghapus akun:", error);
        res.status(500).json({ message: "Server error saat menghapus akun." });
    }
}

module.exports = { changeUserRole, deleteAccount };