import { saveUser, signInUser } from "./firebase.js";
import { createUser } from "./firebase.js";

//Alert wrapper
const alertPlaceholder = document.getElementById('registerAccountAlert');

const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

//Account creation
const signupForm = document.querySelector('#signup-form');

if (signupForm !== null){
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.querySelector('#signup-FirstName').value;
    const lastName = document.querySelector('#signup-LastName').value;
    const email = document.querySelector('#signup-Email').value;
    const password = document.querySelector('#signup-Password').value;

    //saveUser(firstName, lastName, email, password);

    createUser(email, password);
    signupForm.reset();

    //Alert trigger
    alert('Account created successfully', 'success')
  })
}


//Sign-in user
const loginForm = document.querySelector('#login-form');

if (loginForm !== null){
  loginForm.addEventListener('submit', e => {
    e.preventDefault()

    const email = document.querySelector('#login-Email').value;
    const password = document.querySelector('#login-Password').value;

    //saveUser(firstName, lastName, email, password);
    //console.log(email, password)

    signInUser(email, password);
    loginForm.reset();
  })
}



