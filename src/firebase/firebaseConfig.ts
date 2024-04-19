// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'onecard-b0e16.firebaseapp.com',
  projectId: 'onecard-b0e16',
  storageBucket: 'onecard-b0e16.appspot.com',
  messagingSenderId: '306943204991',
  appId: '1:306943204991:web:5109a5ea506741592be94a',
  measurementId: 'G-P0LBFH9D26',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
