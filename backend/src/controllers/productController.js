const getProducts = (req, res) => {
    // 1. Ambil koordinat pembeli yang dikirim dari frontend via Query Parameter
    // Contoh request: /products?lat=-6.200000&lng=106.816666&radius=5
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);
    const maxRadius = parseFloat(req.query.radius) || 10; // Default radius maksimal 10 KM jika frontend tidak kirim

    // 2. Validasi apakah frontend mengirim data koordinat dengan benar
    if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({ error: "Latitude dan Longitude pembeli wajib diisi dan harus berupa angka." });
    }

    // 3. Query SQL dengan rumus Haversine menggunakan kolom latitude & longitude terpisah
    const sql = `
        SELECT 
            p.*, 
            u.first_name AS seller_name,
            u.address AS seller_address,
            u.latitude AS seller_latitude,
            u.longitude AS seller_longitude,
            (
                6371 * acos(
                    cos(radians(?)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?)) + 
                    sin(radians(?)) * sin(radians(u.latitude))
                )
            ) AS distance_km
        FROM product p
        JOIN user u ON p.sellerID = u.userID
        WHERE p.status = 'available'
        HAVING distance_km <= ?
        ORDER BY distance_km ASC
    `;

    // 4. Masukkan variabel pembeli ke dalam array sesuai urutan tanda tanya (?) di query SQL
    // ? Pertama = userLat
    // ? Kedua   = userLng
    // ? Ketiga  = userLat
    // ? Keempat = maxRadius
    const queryParams = [userLat, userLng, userLat, maxRadius];

    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error("Error SQL:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        // 5. Kembalikan data produk yang sudah urut dari yang paling dekat
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