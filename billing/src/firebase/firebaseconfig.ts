// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBC0T6JDzP198yPreubBzffMMFV5y2vKG4",
  authDomain: "selvambroilserspos.firebaseapp.com",
  projectId: "selvambroilserspos",
  storageBucket: "selvambroilserspos.appspot.com",
  messagingSenderId: "999367589410",
  appId: "1:999367589410:web:9f99bbb87003bd768b147b"
};

// Initialize Firebase
const config = initializeApp(firebaseConfig);
export default config;