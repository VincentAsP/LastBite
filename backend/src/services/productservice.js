const productModel = require('../models/productmodels');

// const fetchNearbyProducts = async (lat, lng) => {
//     // 1. Logika Validasi: Pastikan lat dan lng ada
//     if (!lat || !lng) {
//         throw new Error("Latitude dan Longitude harus dikirim!");
//     }

//     // Opsional: Validasi dan konversi ke angka sebelum masuk ke service
//     const latNum = parseFloat(lat);
//     const lngNum = parseFloat(lng);
//     const radius = 2; 

//     try {
//         // 3. Panggil Model untuk ambil data dari database
//         // Pastikan query di findNearbyProducts hanya mengambil produk yang statusnya 'active'
//         const products = await productModel.findNearbyProducts(lat, lng, radius);
        
//         // 4. Logika Kalkulasi Timer (Sisa Waktu)
//         const currentTime = new Date();
        
//         const productsWithTimer = products.map(product => {
//             const expiry = new Date(product.expiryTime);
//             const timeDiff = expiry - currentTime; // Hasilnya dalam milidetik
            
//             // Jika waktu sudah habis (expired)
//             if (timeDiff <= 0) {
//                 return {
//                     ...product,
//                     countdown: 0,
//                     status: 'expired'
//                 };
//             }
            
//             // Jika masih ada waktu, tambahkan sisa detik (countdown)
//             return {
//                 ...product,
//                 countdown: Math.floor(timeDiff / 1000)
//             };
//         });

//         return productsWithTimer;
        
//     } catch (error) {
//         throw new Error("Gagal mengambil data dari database: " + error.message);
//     }
// };

const fetchNearbyProducts = async (lat, lng) => {
  if (!lat || !lng) throw new Error("Latitude dan Longitude harus dikirim!");

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  try {
    const products = await productModel.findNearbyProducts(latNum, lngNum); // ← hapus radius

    const currentTime = new Date();

    const productsWithTimer = products.map(product => {
      const expiry = new Date(product.expiryTime);
      const timeDiff = expiry - currentTime;

      if (timeDiff <= 0) {
        return { ...product, countdown: 0, status: 'expired' };
      }
      return { ...product, countdown: Math.floor(timeDiff / 1000) };
    });

    return productsWithTimer;

  } catch (error) {
    throw new Error("Gagal mengambil data dari database: " + error.message);
  }
};

// Opsional: Kamu bisa tambahkan fungsi khusus update status expired di sini
const updateExpiredProductsStatus = async () => {
    try {
        // Asumsinya kamu menambahkan fungsi updateExpiredProducts di productModel
        const affectedRows = await productModel.updateExpiredProducts(); 
        return affectedRows;
    } catch (error) {
        throw new Error("Gagal memperbarui status kedaluwarsa: " + error.message);
    }
};

module.exports = {
    fetchNearbyProducts,
    updateExpiredProductsStatus
};