firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";


      // ...
    } else {
      // User is signed out
      // ...
      document.getElementById("user_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";

    }
  });

function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(userCredential) {
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage)
  });

}