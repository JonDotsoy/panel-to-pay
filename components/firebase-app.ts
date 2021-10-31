// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvaoPaBJyWOEycTBbprCSDSyrca6ivGM8",
  authDomain: "panel-to-pay.firebaseapp.com",
  projectId: "panel-to-pay",
  storageBucket: "panel-to-pay.appspot.com",
  messagingSenderId: "149846913176",
  appId: "1:149846913176:web:d0763253cf832948a860ed",
  measurementId: "G-16BCRH4KVE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const analytics = !!globalThis.window ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
