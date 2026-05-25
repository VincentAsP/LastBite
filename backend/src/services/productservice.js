const productModel = require('../models/productModel');

const fetchNearbyProducts = async (lat, lng, radius) => {
    // 1. Logika Validasi: Pastikan lat dan lng ada
    if (!lat || !lng) {
        throw new Error("Latitude dan Longitude harus dikirim!");
    }

    // 2. Logika Default: Kalau radius nggak dikirim, set default ke 5 KM
    const searchRadius = radius ? parseFloat(radius) : 5;

    // 3. Panggil Model untuk ambil data dari database
    try {
        const products = await productModel.findNearbyProducts(lat, lng, searchRadius);
        return products;
    } catch (error) {
        throw new Error("Gagal mengambil data dari database: " + error.message);
    }
};

module.exports = {
    fetchNearbyProducts
};