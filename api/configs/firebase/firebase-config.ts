import admin from "firebase-admin";
const serviceAccount = "../firebase/serviceAccount.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
