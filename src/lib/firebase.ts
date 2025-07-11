import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const isBrowser = typeof window !== "undefined";

const firebaseConfig = isBrowser
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
  : {
      apiKey: "FAKE_API_KEY", // prevents Firebase crash on server build
      authDomain: "dummy.firebaseapp.com",
      projectId: "demo",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "000",
      appId: "000",
    };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = isBrowser ? getAuth(app) : null;

export { app, auth };
