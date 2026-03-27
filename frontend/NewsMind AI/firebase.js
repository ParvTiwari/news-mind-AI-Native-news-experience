// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlh6qQXQ6hqS3d_wrYAyXA-cVYlIE1XBY",
  authDomain: "newsmind-ai-fb56a.firebaseapp.com",
  projectId: "newsmind-ai-fb56a",
  storageBucket: "newsmind-ai-fb56a.firebasestorage.app",
  messagingSenderId: "56521174607",
  appId: "1:56521174607:web:9476ce63027ac2f533443a",
  measurementId: "G-199XG7KL0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
