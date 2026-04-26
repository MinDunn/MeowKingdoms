import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLnH9lRxiX1af-o8RK8Xt3pOiTlBlTcV0",
  authDomain: "meowkingdoms.firebaseapp.com",
  projectId: "meowkingdoms",
  storageBucket: "meowkingdoms.firebasestorage.app",
  messagingSenderId: "634429861674",
  appId: "1:634429861674:web:c020c94856694212d87853",
  measurementId: "G-HCLSDPDBEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
