// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCuxKIPsYbtqENKTWDm43xfUGEmY9KW2eU",
  authDomain: "reactchat-4c648.firebaseapp.com",
  databaseURL: "https://reactchat-4c648-default-rtdb.firebaseio.com",
  projectId: "reactchat-4c648",
  storageBucket: "reactchat-4c648.firebasestorage.app",
  messagingSenderId: "120760087415",
  appId: "1:120760087415:web:739c126839a7c76c40e772",
  measurementId: "G-EPSEB1WF49"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

export { app, auth };