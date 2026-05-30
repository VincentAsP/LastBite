const productService = require('../services/productService');

const getProductsByGeolocation = async (req, res) => {
    try {
        // 1. Ambil data dari URL (request)
        const { lat, lng, radius } = req.query;

        // 2. Lempar ke Service untuk diolah
        const nearbyProducts = await productService.fetchNearbyProducts(lat, lng, radius);

        // 3. Kembalikan Response ke user
        res.status(200).json({
            message: "Products fetched successfully",
            count: nearbyProducts.length,
            data: nearbyProducts
        });
    } catch (error) {
        // Tangkap error dari service (misal validasi gagal)
        res.status(400).json({ error: error.message });
    }
};

// 2. POST: Tambah produk baru ke Last Bite
const addProduct = (req, res) => {
    const { sellerID, name, category, stock, status, expiryTime } = req.body;
    
    const sql = 'INSERT INTO product (sellerID, name, category, stock, status, expiryTime) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [sellerID, name, category, stock, status, expiryTime];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'Product added successfully!', 
            productID: result.insertId 
        });
    });
};

// Export function supaya bisa dipakai di file routes kamu
module.exports = {
    getProductsByGeolocation,
    addProduct
};