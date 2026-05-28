const admin = require("firebase-admin");

const serviceAccount = require("../config/firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendPushNotification(fcmToken, title, body) {
    if (!fcmToken) {
        console.log("User tidak punya token FCM, notif dibatalkan.");
        return;
    }

    const message = {
        notification: {
            title: title,
            body: body
        },
        token: fcmToken
    };

    try {
        // Nanti kalau Firebase udah nyala, uncomment ini ya buat kirim notif beneran
        // await admin.messaging().send(message);
        
        console.log(`[SIMULASI NOTIF] Mengirim ke HP User...`);
        console.log(`Judul: ${title} | Isi: ${body}`);
    } catch (error) {
        console.error("Gagal kirim notif:", error);
    }
}

module.exports = { sendPushNotification };