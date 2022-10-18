import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { appController } from "./controller.js"

export class Session {
    constructor() {
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
      this.auth = getAuth(app);
      this.db = getFirestore();
      this.googleProvider = new GoogleAuthProvider();
    }
  
    init() {
      // check if user exists initially
      this.authListener();
    }
  
    authListener() {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          console.log('Auth: signed in! CLASS!!', user.email)
          appController.userAuthenticated();
          // ...
        } else {
          // User is signed out
          // ...
          appController.userNotAuthenticated();
          console.log('Auth: signed out! CLASS!!')
        }
      });
    }
  
    registerUser(newUserData) {
      createUserWithEmailAndPassword(this.auth, newUserData.email, newUserData.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log('account created with email and passowrd')
          //Save user data
          appController.callSaveUserData(user, newUserData.firstName, newUserData.lastName)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + errorMessage)
          // ..
        });
    }
  
    userLogin(existingUserData) {
      signInWithEmailAndPassword(this.auth, existingUserData.email, existingUserData.password)
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
  
    googleLogin() {
      signInWithPopup(this.auth, new GoogleAuthProvider())
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
  
          // The signed-in user info.
          const user = result.user;
          const firstName = user.displayName.split(" ")[0]
          const lastName = user.displayName.split(" ")[1]
          appController.callSaveUserData(user, firstName, lastName)
          console.log('gogole signin')
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }
  
    logoutSession() {
      signOut(this.auth).then(() => {
        // Sign-out successful.
        console.log('logged out!')
  
      }).catch((error) => {
        //An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
      });
  
  
    }
  }