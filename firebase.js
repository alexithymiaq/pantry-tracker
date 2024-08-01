// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, getfirestory} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0OEGpxWrrYLh_mAyY9IrRix0xdrINa54",
  authDomain: "inventory-management-4f258.firebaseapp.com",
  projectId: "inventory-management-4f258",
  storageBucket: "inventory-management-4f258.appspot.com",
  messagingSenderId: "71524015442",
  appId: "1:71524015442:web:b5f7dffb3ec90753e62e8b",
  measurementId: "G-GC160WWQP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}