// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Replace with your app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6678AVVvBT1JNIBpsobpwueYHD0NpOFM",
  authDomain: "petadoptionv2.firebaseapp.com",
  projectId: "petadoptionv2",
  storageBucket: "petadoptionv2.firebasestorage.app",
  messagingSenderId: "952835663487",
  appId: "1:952835663487:web:fcc9c76bdd992e9ac9014a",
  measurementId: "G-H4EF5C97F4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
export const auth = getAuth(app);
export const db = getFirestore(app);