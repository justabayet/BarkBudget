import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQ_RurIHEwv4lSva3fFd0c3RqVSRhVQ20",
    authDomain: "i-need-a-budget-52aff.firebaseapp.com",
    projectId: "i-need-a-budget-52aff",
    storageBucket: "i-need-a-budget-52aff.appspot.com",
    messagingSenderId: "854623851454",
    appId: "1:854623851454:web:e3f9efc9d801c4c92d5fef",
    measurementId: "G-43QBMNS5W0"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const db = getFirestore(firebaseApp);