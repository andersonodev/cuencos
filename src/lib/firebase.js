// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_jGIAB_jhF3u2uALmgi0lYuw7BUGph2Q",
  authDomain: "cuencos.firebaseapp.com",
  projectId: "cuencos",
  storageBucket: "cuencos.firebasestorage.app",
  messagingSenderId: "404680616980",
  appId: "1:404680616980:web:b836ee3e94c220d2e10b01",
  measurementId: "G-V0WRJFZ7FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

// Exportamos outros serviços do Firebase conforme necessário
// Exemplo:
// import { getAuth } from "firebase/auth";
// export const auth = getAuth(app);
