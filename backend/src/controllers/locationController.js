const axios = require('axios');

const getAddressFromCoords = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude dan Longitude harus diisi!" });
    }

    // Menggunakan OpenStreetMap (Nominatim) - Gratis & Tanpa API Key
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    // WAJIB menambahkan 'User-Agent' di bagian headers agar tidak diblokir oleh OpenStreetMap
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'LastBiteApp-Development-Testing'
      }
    });

    const data = response.data;

    // OpenStreetMap mengembalikan alamat di dalam properti 'display_name'
    if (data && data.display_name) {
      console.log("Alamat ditemukan (OSM):", data.display_name);
      
      return res.status(200).json({ 
        success: true, 
        address: data.display_name 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Gagal mendapatkan alamat dari OpenStreetMap" 
      });
    }
  } catch (error) {
    console.error("Error Reverse Geocoding:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan pada server" 
    });
  }
};

module.exports = { getAddressFromCoords };