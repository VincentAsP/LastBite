const db = require('../config/db');


const findNearbyProduct = async (lat, lng, radius) => {
    const sql = `
        SELECT 
            p.*, 
            u.full_name AS seller_name, 
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
        WHERE p.status = 'active'
        HAVING distance_km <= ?
        ORDER BY distance_km ASC
    `;

    const values = [lat, lng, lat, radius];

    const [results] = await db.query(sql, values);
    return results;
};


const updateExpiredProducts = async () => {
    const sql = `
        UPDATE product 
        SET status = 'inactive'
        WHERE expiryTime <= NOW() AND status = 'active'
    `;
    
    const [results] = await db.query(sql);
    
    return results.affectedRows; 
};

module.exports = {
    findNearbyProduct,
    updateExpiredProducts
};