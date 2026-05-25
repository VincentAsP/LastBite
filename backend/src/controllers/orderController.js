const pool = require('../config/db');

async function createTemporaryOrder(req, res) {
    const { userID, items, total_price } = req.body;

    if (!userID || !items || items.length === 0 || !total_price) {
        return res.status(400).json({ message: "Keranjang belanja kosong atau data tidak lengkap!" });
    }

    const connection = await pool.getConnection();

    try {
        const productIDs = items.map(item => item.productID);

        const [sellers] = await connection.query(
            'SELECT DISTINCT sellerID FROM product WHERE productID IN (?)',
            [productIDs]
        );

        if (sellers.length > 1) {
            connection.release();
            return res.status(400).json({ message: "Checkout per toko ya!" });
        }

        await connection.beginTransaction();

        // Mencegah Deadlock
        items.sort((a, b) => a.productID - b.productID);

        for (const item of items) {
            const [rows] = await connection.query(
                'SELECT stock, status FROM product WHERE productID = ? FOR UPDATE', 
                [item.productID]
            );

            if (rows.length === 0) {
                throw new Error(`Produk dengan ID ${item.productID} tidak ditemukan.`);
            }

            const product = rows[0];

            if (product.stock < item.quantity || product.status === 'habis') {
                throw new Error(`Yah, produk ID ${item.productID} habis! Sisa stok: ${product.stock}`);
            }

            await connection.query(
                'UPDATE product SET stock = stock - ? WHERE productID = ?',
                [item.quantity, item.productID]
            );
        }

        const [orderResult] = await connection.query(
            'INSERT INTO `order` (userID, status, total_price) VALUES (?, ?, ?)',
            [userID, 'pending', total_price]
        );
        const newOrderID = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_item (orderID, productID, quantity) VALUES (?, ?, ?)',
                [newOrderID, item.productID, item.quantity]
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({ 
            message: "Semua barang berhasil diamankan! Segera bayar dalam 5 menit.",
            orderID: newOrderID 
        });

        setTimeout(async () => {
            try {
                const [checkOrder] = await pool.query('SELECT status FROM `order` WHERE orderID = ?', [newOrderID]);

                if (checkOrder.length > 0 && checkOrder[0].status === 'pending') {
                    await pool.query('UPDATE `order` SET status = ? WHERE orderID = ?', ['cancelled', newOrderID]);
                    
                    const [itemsToRestore] = await pool.query('SELECT productID, quantity FROM order_item WHERE orderID = ?', [newOrderID]);
                    
                    for (const restoreItem of itemsToRestore) {
                        await pool.query(
                            'UPDATE product SET stock = stock + ? WHERE productID = ?', 
                            [restoreItem.quantity, restoreItem.productID]
                        );
                    }
                    console.log(`[TIMEOUT] Pesanan ${newOrderID} dibatalkan.`);
                }
            } catch (timeoutErr) {
                console.error("Gagal menjalankan auto-rollback:", timeoutErr);
            }
        }, 5 * 60 * 1000);

    } catch (error) {
        await connection.rollback();
        connection.release();
        
        const errorMsg = error.message.includes('stok') || error.message.includes('tidak ditemukan') 
            ? error.message 
            : "Gagal memproses pesanan.";
            
        res.status(400).json({ message: errorMsg });
    }
}

module.exports = { createTemporaryOrder };