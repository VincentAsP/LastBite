
const db = require('../config/db');

const findNearbyProduct = (lat, lng, radius) => {
    return new Promise((resolve, reject) => {
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

        const value = [lat, lng, lat, radius];

        db.query(sql, values, (err, results) => {
            if (err) {
                reject(err); // Kalau error, lempar ke catch di Service
            } else {
                resolve(results); // Kalau sukses, kirim datanya
            }
        });
    });
};

const updateExpiredProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE product 
        SET status = 'inactive'
        WHERE expiryTime <= NOW() AND status = 'active'
        `;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // affectedRows berisi angka jumlah data yang berhasil diubah statusnya
                resolve(results.affectedRows); 
            }
        });
    });
};

module.exports = {
    findNearbyProduct,
    updateExpiredProducts
};