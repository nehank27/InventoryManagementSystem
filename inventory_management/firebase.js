// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXPB7AU0JvBDKko7M-LRyAyo-S5lyk21w",
  authDomain: "inventory-management-14ba4.firebaseapp.com",
  projectId: "inventory-management-14ba4",
  storageBucket: "inventory-management-14ba4.appspot.com",
  messagingSenderId: "727301487200",
  appId: "1:727301487200:web:35def79e76a775f0bb6105",
  measurementId: "G-MW7TKMHMCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};