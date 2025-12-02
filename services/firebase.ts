// services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Config do Firebase (a que você copiou do console)
const firebaseConfig = {
  apiKey: "AIzaSyD5T04pJUWKm9AgJ_yU_odJoZCdbHnRFlI",
  authDomain: "my-finance-ded83.firebaseapp.com",
  projectId: "my-finance-ded83",
  storageBucket: "my-finance-ded83.firebasestorage.app",
  messagingSenderId: "647829417648",
  appId: "1:647829417648:web:4bd4e1e4a81858d8efd575",
  measurementId: "G-Y2R9GLGXB8"
};

// Evita inicializar duas vezes (hot reload do Expo)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore (banco de dados)
export const db = getFirestore(app);

// Auth (login)
export const auth = getAuth(app);

export default app;
