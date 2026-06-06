const db = require('../config/db');
const bcrypt = require('bcrypt');

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

async function getUserPoints(req, res) {
    const { userID } = req.params;
    if (!userID) return res.status(400).json({ message: 'userID wajib diisi.' });
 
    try {
        // Total poin semua waktu
        const [totalRows] = await pool.query(
            `SELECT COALESCE(SUM(points), 0) AS total_points
             FROM user_points WHERE userID = ?`,
            [userID]
        );
 
        // 10 transaksi poin terakhir (untuk riwayat di UI)
        const [history] = await pool.query(
            `SELECT up.points, up.reason, up.created_at,
                    o.total_price AS order_total
             FROM user_points up
             LEFT JOIN \`order\` o ON o.orderID = up.orderID
             WHERE up.userID = ?
             ORDER BY up.created_at DESC
             LIMIT 10`,
            [userID]
        );
 
        res.status(200).json({
            message: 'Data poin berhasil diambil.',
            data: {
                total_points: parseInt(totalRows[0].total_points),
                history
            }
        });
    } catch (error) {
        console.error('[getUserPoints]', error);
        res.status(500).json({ message: 'Server error saat mengambil poin.' });
    }
}

async function updateProfile(req, res) {
  const userID = req.user.id; // dari JWT middleware
  const { full_name, email, phone, address } = req.body;

  try {
    await pool.query(
      'UPDATE user SET full_name = ?, email = ?, phone = ?, address = ? WHERE userID = ?',
      [full_name, email, phone, address, userID]
    );

    const [rows] = await pool.query(
      'SELECT userID, full_name, email, phone, address, roleID FROM user WHERE userID = ?',
      [userID]
    );

    res.status(200).json({ message: 'Profil berhasil diperbarui.', user: rows[0] });
  } catch (error) {
    console.error('[updateProfile]', error);
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email sudah digunakan akun lain.' });
    res.status(500).json({ message: 'Server error saat update profil.' });
  }
}

async function changePassword(req, res) {
  const userID = req.user.id;
  const { current_password, new_password } = req.body;

  try {
    const [rows] = await pool.query('SELECT password FROM user WHERE userID = ?', [userID]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan.' });

    const valid = await bcrypt.compare(current_password, rows[0].password);
    if (!valid)
      return res.status(401).json({ message: 'Password saat ini salah.' });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE user SET password = ? WHERE userID = ?', [hashed, userID]);

    res.status(200).json({ message: 'Password berhasil diubah.' });
  } catch (error) {
    console.error('[changePassword]', error);
    res.status(500).json({ message: 'Server error saat ganti password.' });
  }
}

module.exports = { changeUserRole, deleteAccount, getUserPoints, updateProfile, changePassword };