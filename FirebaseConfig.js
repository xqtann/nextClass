// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2fOHRfqMmYb8duE4lg4fkE4ZW2eXuFhc",
  authDomain: "nextclass-84848.firebaseapp.com",
  projectId: "nextclass-84848",
  storageBucket: "nextclass-84848.appspot.com",
  messagingSenderId: "935966011152",
  appId: "1:935966011152:web:fb79b9181ec15d4fb8ff95",
  measurementId: "G-H4PQ5BCXE2"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);


export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);