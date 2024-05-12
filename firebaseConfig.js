// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCVa2_Yd2MAhiTbHqQO8HVt9KZ5Pz5rHg",
  authDomain: "wattreward-88d0a.firebaseapp.com",
  projectId: "wattreward-88d0a",
  storageBucket: "wattreward-88d0a.appspot.com",
  messagingSenderId: "37394070573",
  appId: "1:37394070573:web:cbd5dff5aacfdcfccb0ca4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
