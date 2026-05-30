const cron = require('node-cron');
const productService = require('../services/productService');

const startCronJobs = () => {
    // Cron job berjalan setiap 1 menit ('* * * * *')
    cron.schedule('* * * * *', async () => {
        try {
            console.log('[Cron] Memeriksa produk yang kedaluwarsa...');
            
            // Panggil fungsi dari productService
            const affectedRows = await productService.updateExpiredProductsStatus();
            
            if (affectedRows > 0) {
                console.log(`[Cron] Berhasil mengupdate ${affectedRows} produk menjadi expired.`);
            }
        } catch (error) {
            console.error('[Cron] Gagal menjalankan update status:', error.message);
        }
    });
};

module.exports = {
    startCronJobs
};    