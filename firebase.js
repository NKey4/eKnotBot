const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://alicebot-d1bdc-default-rtdb.firebaseio.com",
});

const db = getFirestore();

module.exports = { db };
