
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyBu-S-iwLuY0svyg0ocCx6VLswwdjTiY6w",
  authDomain: "text-editor-ed32d.firebaseapp.com",
  projectId: "text-editor-ed32d",
  storageBucket: "text-editor-ed32d.appspot.com",
  messagingSenderId: "1016995411493",
  appId: "1:1016995411493:web:f82c613e563ce3ba0ff1cc"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()


