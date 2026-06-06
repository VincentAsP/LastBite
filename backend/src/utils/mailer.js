//  email: lastbite28@gmail.com
//  pass: ttcw bsbx acth tazc
// 

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lastbite28@gmail.com', 
        pass: 'ttcwbsbxacthtazc'   
    }
});

const sendVerificationEmail = (toEmail, verificationCode) => {
    const mailOptions = {
        from: 'lastbite28@gmail.com',
        to: toEmail,
        subject: 'Verifikasi Akun LastBite Kamu!',
        text: `Halo, LastBiters! Kode OTP verifikasi kamu: ${verificationCode}. Jangan kasih tau siapa-siapa ya!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email gagal dikirim:', error);
        } else {
            console.log('Email OTP berhasil dikirim!', info.response);
        }
    });
};

module.exports = sendVerificationEmail;