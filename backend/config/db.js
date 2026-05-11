const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: '',           
  database: 'lastbite'
});

db.connect((err) => {
  if (err) {
    console.error('Gagal connect ke database:', err);
    return;
  }
  console.log('Berhasil connect ke database');
});

module.exports = db;