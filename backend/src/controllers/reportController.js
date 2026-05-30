const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/reports/',
    filename: (req, file, cb) => {
        cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage }).single('image');

async function submitReport(req, res) {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: "Gagal upload gambar!" });

        const { orderID, userID, issue_type, description } = req.body;
        const imagePath = req.file ? `/uploads/reports/${req.file.filename}` : null;

        try {
            await pool.query(
                'INSERT INTO report (orderID, userID, issue_type, description, image_path) VALUES (?, ?, ?, ?, ?)',
                [orderID, userID, issue_type, description, imagePath]
            );
            res.status(201).json({ message: "Laporan berhasil dikirim, Admin segera bertindak!" });
        } catch (error) {
            res.status(500).json({ message: "Server error saat submit laporan." });
        }
    });
}

async function getReports(req, res) {
    try {
        const [reports] = await pool.query('SELECT * FROM report ORDER BY created_at DESC');
        res.status(200).json({ data: reports });
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil laporan." });
    }
}

async function resolveReport(req, res) {
    const { reportID } = req.params;
    try {
        await pool.query('UPDATE report SET status = "resolved" WHERE reportID = ?', [reportID]);
        res.status(200).json({ message: "Laporan sudah ditutup (resolved)!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal update status laporan." });
    }
}

async function suspendSeller(req, res) {
    const { sellerID } = req.body;
    try {
        await pool.query('UPDATE user SET status = "suspended" WHERE userID = ?', [sellerID]);
        
        await pool.query('UPDATE product SET status = "inactive" WHERE sellerID = ?', [sellerID]);
        
        res.status(200).json({ message: `Toko ID ${sellerID} berhasil di-suspend!` });
    } catch (error) {
        res.status(500).json({ message: "Gagal suspend toko." });
    }
}

module.exports = { submitReport, getReports, resolveReport, suspendSeller };