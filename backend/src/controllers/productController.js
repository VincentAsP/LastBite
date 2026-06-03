const db = require('../config/db');
const { getProductStock } = require('../../../LastBite_App/src/api/foodItemsApi');
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

exports.getProductStock = async (req, res) => {
  const { productID } = req.params;
 
  try {
    const [rows] = await db.query(
      'SELECT productID, name, stock, status FROM product WHERE productID = ?',
      [productID]
    );
 
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan.',
      });
    }

    const product = rows[0];
 
    if (product.stock <= 0 && product.status === 'active') {
      await db.query(
        "UPDATE product SET status = 'inactive' WHERE productID = ?",
        [productID]
      );
      product.status = 'inactive';
    }
 
    if (product.stock > 0 && product.status === 'inactive') {   
      await db.query(
        "UPDATE product SET status = 'active' WHERE productID = ?",
        [productID]
      );
      product.status = 'active';
    }
    return res.json({
        success: true,
      data: {
        productID: product.productID,
        name:      product.name,
        stock:     product.stock,
        status:    product.status,
        can_buy:   product.stock > 0 && product.status === 'active',
      },
    });
    } catch (error) {
    console.error('[getProductStock]', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data stok.',
    });
  }
};


// Export function supaya bisa dipakai di file routes kamu
module.exports = {
    getProductsByGeolocation,
    addProduct,
    getProductStock
};