import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDZ6stew2EbOyL9wkbYUk0HkD3RHiKLfj0",
    authDomain: "namsn-43745.firebaseapp.com",
    projectId: "namsn-43745",
    storageBucket: "namsn-43745.firebasestorage.app",
    messagingSenderId: "624563062277",
    appId: "1:624563062277:web:f799da88b55f0891113e6c",
    measurementId: "G-LZSQN8NZCJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

export default app;
