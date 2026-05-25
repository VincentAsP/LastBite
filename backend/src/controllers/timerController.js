// controllers/timer.controller.js

// Simulasi database/penyimpanan sementara.
// Di dunia nyata, Anda menyimpannya di Database (MySQL/MongoDB/PostgreSQL) atau Redis.
const activeTimers = {}; 

const syncTime = (req, res) => {
    try {
        // Asumsikan ada ID user yang dikirim dari client (misal: via query atau token)
        // Jika tidak ada, kita pakai 'guest' sebagai default untuk contoh ini
        const userId = req.query.userId || 'guest-123'; 
        
        const serverTime = Date.now();
        const timerDuration = 10 * 60 * 1000; // 10 menit

        // Cek apakah user ini sudah punya timer yang berjalan
        if (!activeTimers[userId]) {
            // Jika belum ada, buat deadline baru
            activeTimers[userId] = serverTime + timerDuration;
        }

        const endTime = activeTimers[userId];

        // Kirim response
        return res.status(200).json({
            success: true,
            serverTime: serverTime,
            endTime: endTime
        });

    } catch (error) {
        console.error("Error in syncTime controller:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

module.exports = {
    syncTime
};