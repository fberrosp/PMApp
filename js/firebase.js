// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyA79i2Jibtq8lEAMhBw42gN5m_x0KnesXc",
authDomain: "issuetrackingsystem-9d0f7.firebaseapp.com",
projectId: "issuetrackingsystem-9d0f7",
storageBucket: "issuetrackingsystem-9d0f7.appspot.com",
messagingSenderId: "1004125926086",
appId: "1:1004125926086:web:6c1049212084453c485dc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore

export function createUser (email, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('account created!')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
      // ..
    });
}

//Siign-in user
export function signInUser (email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('logged in!')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
    });
}


export const saveUser = (firstName, lastName, email, password) => {
    addDoc(collection(db, 'tasks'))
    console.log(firstName, lastName, email, password)
}
