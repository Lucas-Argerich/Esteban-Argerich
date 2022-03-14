import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyAgjUty3xBx4ry_qKohjoytrgz8WXuhkuA",
  authDomain: "esteban-argerich-photographer.firebaseapp.com",
  projectId: "esteban-argerich-photographer",
  storageBucket: "esteban-argerich-photographer.appspot.com",
  messagingSenderId: "230275487083",
  appId: "1:230275487083:web:56837305e251a7e541682e",
  measurementId: "G-2ZTBWFEPK4",
});
const analytics = getAnalytics(app);
export const db = getFirestore();
