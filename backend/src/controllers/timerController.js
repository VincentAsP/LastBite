async function getTimer(req, res){
     const [products] = await db.query('SELECT * FROM product WHERE status = "active"');
        
        const currentTime = new Date();

        const productsWithTimer = products.map(product => {
            const expiry = new Date(product.expiryTime);
            const timeDiff = expiry - currentTime; // Hasilnya dalam milidetik

            // Cek apakah sudah expired
            if (timeDiff <= 0) {
                return { ...product, countdown: 0, status: 'expired' };
            }

            return { 
                ...product, 
                countdown: Math.floor(timeDiff / 1000) // Kirim sisa waktu dalam detik ke frontend
            };
        });

        res.json(productsWithTimer);
}