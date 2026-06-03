const pool = require('../config/db');
const midtransClient = require('midtrans-client');
const { sendPushNotification } = require('../utils/notification');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY, 
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

async function awardPoints(orderID) {
    try {
        // Ambil userID dan total_price dari order
        const [orderRows] = await pool.query(
            'SELECT userID, total_price FROM `order` WHERE orderID = ?',
            [orderID]
        );
        if (orderRows.length === 0) return;
 
        const { userID, total_price } = orderRows[0];
 
        // Cegah double-award: cek apakah poin sudah pernah diberikan
        const [existing] = await pool.query(
            'SELECT pointID FROM user_points WHERE orderID = ?',
            [orderID]
        );
        if (existing.length > 0) {
            console.log(`[Points] Order ${orderID} sudah dapat poin, skip.`);
            return;
        }
 
        // Hitung poin: 10 poin dasar + 1 poin per Rp10.000
        const bonusPoints  = Math.floor(total_price / 10000);
        const totalPoints  = 10 + bonusPoints;
 
        // Simpan ke tabel user_points (lihat schema di schema-points.sql)
        await pool.query(
            `INSERT INTO user_points (userID, orderID, points, reason, created_at)
             VALUES (?, ?, ?, 'order_completed', NOW())`,
            [userID, orderID, totalPoints]
        );
 
        console.log(`[Points] Order ${orderID}: +${totalPoints} poin untuk user ${userID}`);
    } catch (err) {
        // Jangan sampai error poin membatalkan response ke user
        console.error('[Points] Gagal award poin:', err.message);
    }
}

// API CHECKOUT (+ Generate Link Bayar Midtrans)
async function checkoutOrder(req, res) {
    const { userID, items, subtotal_price, delivery_method, address } = req.body;

    if (!userID || !items || items.length === 0 || !subtotal_price || !delivery_method) {
        return res.status(400).json({ message: "Keranjang atau data pengiriman tidak lengkap!" });
    }

    const connection = await pool.getConnection();

    try {
        // Satpam 1 Toko
        const productIDs = items.map(item => item.productID);
        const [sellers] = await connection.query('SELECT DISTINCT sellerID FROM product WHERE productID IN (?)', [productIDs]);

        if (sellers.length > 1) {
            connection.release();
            return res.status(400).json({ message: "Checkout per toko ya!" });
        }

        await connection.beginTransaction();
        items.sort((a, b) => a.productID - b.productID);

        // Kunci & Kurangi Stok
        for (const item of items) {
            const [rows] = await connection.query('SELECT stock, status FROM product WHERE productID = ? FOR UPDATE', [item.productID]);
            if (rows.length === 0) throw new Error(`Produk ID ${item.productID} tidak ditemukan.`);
            
            const product = rows[0];
            if (product.stock < item.quantity || product.status === 'inactive') {
                throw new Error(`Stok produk ID ${item.productID} habis!`);
            }
            await connection.query('UPDATE product SET stock = stock - ? WHERE productID = ?', [item.quantity, item.productID]);
        }

        // Kalkulasi Ongkir
        let ongkir = 0;
        let finalAddress = address;

        if (delivery_method === 'Delivery') {
            ongkir = 10000;
            if (!address) throw new Error("Alamat wajib diisi kalau pilih Delivery!");
        } else {
            finalAddress = 'Ambil di Toko'; 
        }

        const grand_total = subtotal_price + ongkir;

        // Bikin Nota
        const [orderResult] = await connection.query(
            'INSERT INTO `order` (userID, status, total_price) VALUES (?, ?, ?)',
            [userID, 'pending', grand_total]
        );
        const newOrderID = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_item (orderID, productID, quantity) VALUES (?, ?, ?)',
                [newOrderID, item.productID, item.quantity]
            );
        }

        await connection.query(
            'INSERT INTO delivery (orderID, method, address) VALUES (?, ?, ?)',
            [newOrderID, delivery_method, finalAddress]
        );

        await connection.commit();
        connection.release();

        const midtransParams = {
            transaction_details: {
                order_id: `LASTBITE-${newOrderID}-${Date.now()}`, 
                gross_amount: grand_total
            },
            customer_details: {
                first_name: `User-${userID}`
            }
        };

        const transaction = await snap.createTransaction(midtransParams);

        // Kirim link bayar ke Front-End
        res.status(201).json({ 
            message: "Barang diamankan! Silakan bayar.",
            orderID: newOrderID,
            grand_total: grand_total,
            payment_url: transaction.redirect_url // <-- INI YANG BAKAL DIBUKA SAMA ANAK FRONT-END!
        });

        // Timer Rollback 5 Menit
        setTimeout(async () => {
            try {
                const [checkOrder] = await pool.query('SELECT status FROM `order` WHERE orderID = ?', [newOrderID]);
                if (checkOrder.length > 0 && checkOrder[0].status === 'pending') {
                    await pool.query('UPDATE `order` SET status = ? WHERE orderID = ?', ['cancelled', newOrderID]);
                    const [itemsToRestore] = await pool.query('SELECT productID, quantity FROM order_item WHERE orderID = ?', [newOrderID]);
                    for (const restoreItem of itemsToRestore) {
                        await pool.query('UPDATE product SET stock = stock + ? WHERE productID = ?', [restoreItem.quantity, restoreItem.productID]);
                    }
                    console.log(`[TIMEOUT] Pesanan ${newOrderID} hangus. Stok dikembalikan.`);
                }
            } catch (err) {
                console.error("Gagal auto-rollback:", err);
            }
        }, 5 * 60 * 1000);

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Error:", error);
        const errorMsg = error.message.includes('stok') || error.message.includes('tidak ditemukan') || error.message.includes('Alamat')
            ? error.message : "Gagal memproses pesanan.";
        res.status(400).json({ message: errorMsg });
    }
}

// API SIMULASI BAYAR
async function confirmPayment(req, res) {
    const { orderID } = req.body;

    if (!orderID) return res.status(400).json({ message: "OrderID wajib dikirim!" });

    try {
        const [delivCheck] = await pool.query('SELECT method FROM delivery WHERE orderID = ?', [orderID]);
        
        if (delivCheck.length === 0) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan." });
        }

        const deliveryMethod = delivCheck[0].method;

        await pool.query("UPDATE `order` SET status = 'paid' WHERE orderID = ?", [orderID]);

        // Kirim notifikasi ke user
                const [userToken] = await pool.query(
                    'SELECT u.fcm_token FROM user u JOIN `order` o ON u.userID = o.userID WHERE o.orderID = ?', 
                    [orderID]
                );
                
                if (userToken.length > 0 && userToken[0].fcm_token) {
                    await sendPushNotification(
                        userToken[0].fcm_token, 
                        "Payment Secured!", 
                        "Your order is confirmed. Our courier is warming up the engine!"
                    );
                }

        res.status(200).json({ message: "Pembayaran Sukses! Kurir meluncur." });

        // Logika Kurir
        if (deliveryMethod === 'Delivery') {
            setTimeout(async () => {
                await pool.query("UPDATE delivery SET shipping_status = 'Driver picking up' WHERE orderID = ?", [orderID]);
                console.log(`[Order ${orderID}]: Driver sedang mengambil makanan...`);
            }, 5000);

            setTimeout(async () => {
                await pool.query("UPDATE delivery SET shipping_status = 'On the way' WHERE orderID = ?", [orderID]);
                console.log(`[Order ${orderID}]: Makanan dibawa driver menuju rumah...`);
            }, 10000);

            setTimeout(async () => {
                await pool.query("UPDATE delivery SET shipping_status = 'Delivered' WHERE orderID = ?", [orderID]);
                await pool.query("UPDATE `order` SET status = 'completed' WHERE orderID = ?", [orderID]);
                await awardPoints(orderID);
                // Kirim notifikasi ke user
                const [userToken] = await pool.query(
                    'SELECT u.fcm_token FROM user u JOIN `order` o ON u.userID = o.userID WHERE o.orderID = ?', 
                    [orderID]
                );
                
                if (userToken.length > 0 && userToken[0].fcm_token) {
                    await sendPushNotification(
                        userToken[0].fcm_token, 
                        "Your Mystery Box is Here!", 
                        "The courier has arrived. Time to rescue your food and enjoy!"
                    );
                }

                console.log(`[Order ${orderID}]: Pengiriman selesai!`);
            }, 15000);

        } else if (deliveryMethod === 'Self Pickup') {
            setTimeout(async () => {
                await pool.query("UPDATE delivery SET shipping_status = 'Picked Up' WHERE orderID = ?", [orderID]);
                await pool.query("UPDATE `order` SET status = 'completed' WHERE orderID = ?", [orderID]);
                await awardPoints(orderID);
                console.log(`[Order ${orderID}]: Makanan telah diambil pembeli!`);
            }, 5000);
        }

    } catch (error) {
        console.error("Gagal verifikasi pembayaran:", error);
        res.status(500).json({ message: "Server error saat memproses pembayaran." });
    }
}

// API GENERATE INVOICE
async function getInvoice(req, res) {
    const { orderID } = req.params;

    if (!orderID) return res.status(400).json({ message: "OrderID tidak boleh kosong!" });

    try {
        const orderQuery = `
            SELECT o.orderID, o.status AS order_status, o.total_price, 
                   d.method AS delivery_method, d.address, d.shipping_status
            FROM \`order\` o
            JOIN delivery d ON o.orderID = d.orderID
            WHERE o.orderID = ?
        `;
        const [orderData] = await pool.query(orderQuery, [orderID]);

        if (orderData.length === 0) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan!" });
        }

        const itemsQuery = `
            SELECT oi.quantity, p.name, p.category 
            FROM order_item oi
            JOIN product p ON oi.productID = p.productID
            WHERE oi.orderID = ?
        `;
        const [itemsData] = await pool.query(itemsQuery, [orderID]);

        const invoice = {
            invoice_id: `INV-LASTBITE-${orderID}`,
            details: orderData[0],
            items: itemsData
        };

        res.status(200).json({
            message: "Invoice berhasil di-generate!",
            data: invoice
        });

    } catch (error) {
        console.error("Gagal generate invoice:", error);
        res.status(500).json({ message: "Server error saat mengambil data invoice." });
    }
}

module.exports = { checkoutOrder, confirmPayment, getInvoice };