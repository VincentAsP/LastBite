// routes/timer.routes.js
const express = require('express');
const router = express.Router();

// Import fungsi dari controller
// Endpoint untuk mengambil waktu server yang valid
app.get('/api/server-time', (req, res) => {
    const currentTime = new Date();
    
    res.json({
        success: true,
        // Kirim dalam format milidetik (timestamp) agar mudah dihitung di frontend
        timestamp: currentTime.getTime(), 
        // Kirim juga format ISO untuk debugging jika diperlukan
        iso: currentTime.toISOString() 
    });
    
});

// Definisikan endpoint GET /sync-time
router.get('/sync-time', syncTime);

module.exports = router; 