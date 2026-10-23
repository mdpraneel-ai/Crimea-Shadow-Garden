import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js";
import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCR-UXgzUGHqVblfbKxcgSnxOuQg99K92E",
    authDomain: "shadow-garden-ce063.firebaseapp.com",
    projectId: "shadow-garden-ce063",
    storageBucket: "shadow-garden-ce063.firebasestorage.app",
    messagingSenderId: "673261138815",
    appId: "1:673261138815:web:e08985b80a031483a1204a"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);

export const authReady = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();

        if (user) {
            resolve(user);
        } else {
            signInAnonymously(auth)
                .then(result => resolve(result.user))
                .catch(reject);
        }
    }, reject);
});

console.log("Shadow Garden connected to Firebase!");