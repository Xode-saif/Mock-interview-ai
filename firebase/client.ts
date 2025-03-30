// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1ageyh4RExbm0qFeJBPBRgjViWc9790k",
  authDomain: "prepwise-a595b.firebaseapp.com",
  projectId: "prepwise-a595b",
  storageBucket: "prepwise-a595b.firebasestorage.app",
  messagingSenderId: "79768361897",
  appId: "1:79768361897:web:7a2ed34b80390580ab02b8",
  measurementId: "G-ZN6C4HEHNN"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
