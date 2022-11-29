import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoL8Mj7bc4FReKEnS4SNy0rHBV4SgKBxA",
  authDomain: "sharecount-333.firebaseapp.com",
  projectId: "sharecount-333",
  storageBucket: "sharecount-333.appspot.com",
  messagingSenderId: "318408072050",
  appId: "1:318408072050:web:c709a1362b7facf8b61beb",
  measurementId: "G-04J0PM7PKX"
};

 const firebase = initializeApp(firebaseConfig);

 export const auth = getAuth(firebase);