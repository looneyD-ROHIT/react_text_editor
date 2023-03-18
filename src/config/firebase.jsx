
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_apiKey}`,
  authDomain: `${import.meta.env.VITE_authDomain}`,
  projectId: `${import.meta.env.VITE_projectId}`,
  storageBucket: `${import.meta.env.VITE_storageBucket}`,
  messagingSenderId: `${import.meta.env.VITE_messagingSenderId}`,
  appId: `${import.meta.env.VITE_appId}`,
  databaseURL: `${import.meta.env.VITE_databaseURL}`,
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app)

export const rtdb = getDatabase(app)

export const provider = new GoogleAuthProvider()


