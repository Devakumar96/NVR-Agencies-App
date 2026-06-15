import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGdF77P6TFUZoBNxjShbvlxCjbdKwlFO8",
    authDomain: "nvr-agencies-a991c.firebaseapp.com",
    projectId: "nvr-agencies-a991c",
    storageBucket: "nvr-agencies-a991c.firebasestorage.app",
    messagingSenderId: "805191637106",
    appId: "1:805191637106:web:2bbb36deaf1a8ff7aa0aeb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
