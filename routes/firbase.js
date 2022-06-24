
const { initializeApp } =require ("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyDKCGgiRinVXoDfOtHGf_LQ6-zge2reN_U",
  authDomain: "graduationproject-defb2.firebaseapp.com",
  projectId: "graduationproject-defb2",
  storageBucket: "graduationproject-defb2.appspot.com",
  messagingSenderId: "354079041168",
  appId: "1:354079041168:web:261552958ebb92c5311a15",
  measurementId: "G-VH4E7TW6JF"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail} =require("firebase/auth");

const auth = getAuth(firebaseApp );

module.exports={auth,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail }

