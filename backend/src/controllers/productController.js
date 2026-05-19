const getProducts = (req, res) => {
    const sql = 'SELECT * FROM product';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
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
    getProducts,
    addProduct
};