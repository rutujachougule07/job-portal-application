import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbzKGt_lifA0jsZFc13yO1EgS86dm6pbI",
  authDomain: "job-portal-729b6.firebaseapp.com",
  projectId: "job-portal-729b6",
  storageBucket: "job-portal-729b6.firebasestorage.app",
  messagingSenderId: "1000731725448",
  appId: "1:1000731725448:web:ffde1b8a738849c6bc593d",
  measurementId: "G-BWY14L23SE",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
