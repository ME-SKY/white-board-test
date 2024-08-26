// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRbxKa9j7_XsJEQHsffvL8RPFfKkOqTNw",
  authDomain: "white-board-test-a6596.firebaseapp.com",
  projectId: "white-board-test-a6596",
  storageBucket: "white-board-test-a6596.appspot.com",
  messagingSenderId: "1001498770879",
  appId: "1:1001498770879:web:76ea7dceab0a93cd3a350a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
