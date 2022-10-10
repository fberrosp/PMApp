// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, getDoc, updateDoc, Timestamp, orderBy, query, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//ADD WHITELIST TO FIREBASE (WHICH APPS CAN CONNECT TO FIREBASE SERVER)
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
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

//------------------------------------------------------AUTH------------------------------------------------------

//Save user data on collection
function saveUserData(user, firstName, lastName){
  const userData = {
    email: user.email,
    firstName: firstName,
    lastName: lastName,
    lastLogin: Timestamp.now()
  };

  setDoc(doc(db, 'users', user.uid), userData)
  .then(() => {

    console.log('account data saved!')
  })
}

//Create user and store its data with emaila nd pw
export function createUser (email, password, firstName, lastName){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('account created with email and passowrd')
      //Save user data
      saveUserData(user, firstName, lastName)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
      // ..
    });
}

//create user with google
export function googleSignIn () {
  signInWithPopup(auth, googleProvider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const firstName = user.displayName.split(" ")[0]
    const lastName = user.displayName.split(" ")[1]

    saveUserData(user, firstName, lastName)
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

//Siign-in user
export function signInUser (email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('logged in!')
      // ...
      window.location = 'index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
    });
    return user
}

//Logout
export function logOutUser (){
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('logged out!')

  }).catch((error) => {
    //An error happened.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage)
  });
}

//Auth state changed
export function checkState (){
  onAuthStateChanged(auth, (user) => {

    if (user) { 
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log('Auth: signed in!', user.email)

      if (window.location.toString().includes('login.html') || window.location.toString().includes('register.html')) { //user signed in but still in login or register screen
        window.location = "index.html"
      }

      // ...
    } else if ( !window.location.toString().includes('login.html') || !window.location.toString().includes('register.html')){ //redirect to login or register if logged out
      window.location = 'login.html'
      console.log('Auth: signed out! login again!')
    } else {
      window.location = "login.html"
      // User is signed out
      // ...
      console.log('Auth: signed out! register')
    }
  });
}

//------------------------------------------------------TASKS------------------------------------------------------
//Save task
export const saveTask = (taskData) => addDoc(collection(db, 'tasks'), taskData);

//edit task
export const getTask = id => getDoc(doc(db, 'tasks', id));

//delete task
export const deleteTask = id => deleteDoc(doc(db, 'tasks', id));

//update task
export const updateTask = (id, taskData) => updateDoc(doc(db, 'tasks', id), taskData);

//TASKS - real time updating
export const onGetTasks = (callback) => {
  const currentData = query(collection(db, 'tasks'), orderBy('creationDate', 'desc'))
  //console.log(currentData)
  onSnapshot(currentData, callback);
};

//------------------------------------------------------PROJECTS------------------------------------------------------
//save project
export const saveProject = (projectName, projectOwner, description) => {
  const creationDate = Timestamp.now()
  console.log(creationDate)
  addDoc(collection(db, 'projects'), { projectName, projectOwner, description, creationDate })
}

//edit project
export const getProject = id => getDoc(doc(db, 'projects', id));

//delete project
export const deleteProject = id => deleteDoc(doc(db, 'projects', id));

//update project
export const updateProject = (id, newFields) => updateDoc(doc(db, 'projects', id), newFields);

//PROJECTS - real time updating
export const onGetProjects = (callback) => {
  const currentData = query(collection(db, 'projects'), orderBy('creationDate', 'desc'))
  //console.log(currentData)
  onSnapshot(currentData, callback);
}


//------------------------------------------------------OTHER------------------------------------------------------

//getTimestamp
export const getTimestamp = () => {
  return Timestamp.now()
}