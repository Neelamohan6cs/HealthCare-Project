import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDR5A_neWeDqVshvQ4IBH-_sYvMAzVz5ts",
  authDomain: "smart-healthcare-iot-d8d7a.firebaseapp.com",
  databaseURL: "https://smart-healthcare-iot-d8d7a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-healthcare-iot-d8d7a",
  storageBucket: "smart-healthcare-iot-d8d7a.firebasestorage.app",
  messagingSenderId: "80060436235",
  appId: "1:80060436235:web:0be8f2d3d28823f4f2dc0e",
  measurementId: "G-P85THXS30V"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);