// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbzKGt_lifA0jsZFc13yO1EgS86dm6pbI",
  authDomain: "job-portal-729b6.firebaseapp.com",
  projectId: "job-portal-729b6",
  storageBucket: "job-portal-729b6.firebasestorage.app",
  messagingSenderId: "1000731725448",
  appId: "1:1000731725448:web:ffde1b8a738849c6bc593d",
  measurementId: "G-BWY14L23SE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export let analytics = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
