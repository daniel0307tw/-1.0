import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { UserData } from './types';
import { MobileFrame } from './components/MobileFrame';
import { LoginView } from './components/LoginView';
import { MainWorkView } from './components/MainWorkView';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx5XDXGxXeweId6BKg-hIAbxDzMii-NmY",
  projectId: "gen-lang-client-0512792925",
  appId: "1:168512754409:web:cea5287619b7639f10d678",
  authDomain: "gen-lang-client-0512792925.firebaseapp.com",
  storageBucket: "gen-lang-client-0512792925.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-7ee74f47-14be-433b-9259-ef29d86769ce");

export default function App() {
  const [activeUser, setActiveUser] = useState<UserData | null>(null);

  // Real-time synchronization with Firestore for the active user
  useEffect(() => {
    if (!activeUser?.username) return;

    const userDocRef = doc(db, 'users', activeUser.username);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        setActiveUser(data);
      }
    });

    return () => unsubscribe();
  }, [activeUser?.username]);

  return (
    <MobileFrame>
      {!activeUser ? (
        <LoginView db={db} onLoginSuccess={(user) => setActiveUser(user)} />
      ) : (
        <MainWorkView db={db} user={activeUser} onLogout={() => setActiveUser(null)} />
      )}
    </MobileFrame>
  );
}
