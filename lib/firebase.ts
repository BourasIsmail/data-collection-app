import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGDCfPwzOjlEic8cbeogOB-jW_EdFUw4Y",
  authDomain: "temp-data-b9326.firebaseapp.com",
  projectId: "temp-data-b9326",
  storageBucket: "temp-data-b9326.firebasestorage.app",
  messagingSenderId: "793762442693",
  appId: "1:793762442693:web:6bf62b89ea9c6cfb5c2fac",
  measurementId: "G-GTX29V7SXX"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
