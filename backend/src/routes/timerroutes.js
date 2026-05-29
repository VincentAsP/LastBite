const express = require('express');
const router = express.Router();


app.get('/api/server-time', (req, res) => {
    const currentTime = new Date();
    
    res.json({
        success: true,
        timestamp: currentTime.getTime(), 
        iso: currentTime.toISOString() 
    });
    
});

router.get('/sync-time', syncTime);

module.exports = router; 