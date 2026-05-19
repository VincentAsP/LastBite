### SETUP

untuk Setup ada beberapa langkah dlu sebelum kamu buat

## 1. Install axios

cara install nya cuman _npm install axios_ di terminal.

## 2. Import axios

_import axios from 'axios';_

## 3. Pakai aja

contoh : _const response = await axios.post("http://localhost:3000/api/login', {
email: email,
password: password
})_

dapet pos dari mana? itu ambil aja dari Method yangg udah di kasih dari BE. Untuk URL nya nanti di cek di atasnya.

## 1. Register User

Mendaftarkan pengguna baru dan mengirimkan email OTP.

- **URL:** `/api/register`
- **Method:** `POST`
- **Body Request (JSON):**
  ```json
  {
    "username": "axel",
    "email": "user@gmail.com",
    "password": "password123",
    "roleID": 1,
    "address": "Jakarta"
  }
  ```
  ## 2. Login User

Login pengguna dan mengirimkan email OTP.

- **URL:** `/api/login`
- **Method:** `POST`
- **Body Request (JSON):**
  ```json
  {
    "email": "user@gmail.com",
    "password": "password123"
  }
  ```
