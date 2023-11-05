// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpUNovtMLki4vAujbAhoZvIZklG4CVj14",
  authDomain: "react-notes-fc37f.firebaseapp.com",
  projectId: "react-notes-fc37f",
  storageBucket: "react-notes-fc37f.appspot.com",
  messagingSenderId: "489523225300",
  appId: "1:489523225300:web:acb4f89d55ede181b5d141"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")