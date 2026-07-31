import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "umaapp-ebdfa",
  appId: "1:398107264271:web:d86ca2944019338db6ea7a",
  apiKey: "AIzaSyBgrkj-4Zzl1xsSMJl47FNRkT4GNTwOQBg",
  authDomain: "umaapp-ebdfa.firebaseapp.com",
  storageBucket: "umaapp-ebdfa.firebasestorage.app",
  messagingSenderId: "398107264271"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-kopsudi-1e61b52f-71bf-4e22-9535-04c5a5ca26fa");
