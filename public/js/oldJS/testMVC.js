// ------------------------------------MODEL--------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, getDoc, updateDoc, Timestamp, orderBy, query, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


class Model {

  saveUserData(user, firstName, lastName) {
    const userData = {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      lastLogin: Timestamp.now()
    };
    setDoc(doc(appController.appSession.db, 'users', user.uid), userData)
      .then(() => {
        console.log('account data saved!')
      })
  }

  onGetProjects(callback) {
    const currentData = query(collection(appController.appSession.db, 'projects'), orderBy('creationDate', 'desc'))
    //console.log(currentData)
    onSnapshot(currentData, callback);
  }

  saveProject(saveFields) {
    addDoc(collection(appController.appSession.db, 'projects'), saveFields)
  }

  async getProject(id) {
    await getDoc(doc(appController.appSession.db, 'projects', id));
  }

  deleteProject(id) {
    deleteDoc(doc(appController.appSession.db, 'projects', id));
  }

  updateProject(id, newFields) {
    updateDoc(doc(appController.appSession.db, 'projects', id), newFields);
  }

  getTasksofProjects(location, callback) {
    const currentData = query(collection(appController.appSession.db, location), orderBy('creationDate', 'desc'))
    //console.log(currentData)
    onSnapshot(currentData, callback);
  };

  deleteTask(id) {
    deleteDoc(doc(appController.appSession.db, location, id));
  }

  async getTask(id, location) {
    await getDoc(doc(appController.appSession.db, location, id));
  }

  saveTask(taskData, location) {
    addDoc(collection(appController.appSession.db, location), taskData);
  }

  updateTask(id, taskData, location) {
    updateDoc(doc(appController.appSession.db, location, id), taskData);
  }
}


// ------------------------------------VIEW--------------------------------
class View {
  constructor() {
    this.newUserData = {};
    this.existingUserData = {};
  }

  init() {
    //redirect to login if user is not authenticated
    if (!window.location.toString().includes('login.html') || !window.location.toString().includes('register.html')) {
      window.location.href = 'login.html'
    }

    //listen for submition (for user creation or login) clicking and then return values to controller
    //-----------------------------SIGNUP FORM-------------------------------------
    const signupForm = document.querySelector('#signup-form');
    if (signupForm !== null) {
      signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const firstName = document.querySelector('#signup-FirstName').value;
        const lastName = document.querySelector('#signup-LastName').value;
        const email = document.querySelector('#signup-Email').value;
        const password = document.querySelector('#signup-Password').value;
        this.newUserData = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password
        }
        appController.callRegisterUser(this.newUserData);
        signupForm.reset();
      })
    }

    //--------------------------------LOGIN FORM--------------------------------------
    //Google Login
    const googleButton = document.querySelector('#googleLogin')
    if (googleButton !== null) {
      googleButton.addEventListener('click', e => {
        appController.callGoogleLogin();
      })
    }

    //Sign-in user
    const loginForm = document.querySelector('#login-form');
    if (loginForm !== null) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.querySelector('#login-Email').value;
        const password = document.querySelector('#login-Password').value;
        this.existingUserData = {
          email: email,
          password: password
        }
        appController.callUserLogin(this.existingUserData);
        loginForm.reset();
      })
    }
  }

  indexView() {
    //redirect to index if user is authenticated
    if (window.location.toString().includes('login.html') || window.location.toString().includes('register.html')) {
      window.location.href = 'index.html'
    }

    //display projects (dashboard in the future)
    this.displayProjects();

    //listen to logout
    const logout = document.querySelector('#logout-button');
    if (logout !== null) {
      logout.addEventListener('click', e => {
        e.preventDefault();
        appController.callUserLogout();
      })
    }
  }

  displayProjects() {
    const displayProjects = document.querySelector('.display-projects');
    const displayProjectTasks = document.querySelector('.display-project-tasks');
    displayProjects.style.display = 'block'
    displayProjectTasks.style.display = 'none'

    const projectForm = document.getElementById('project-form');
    const projectTableBody = document.getElementById('project-table-body');
    const projectRowData = document.createDocumentFragment();
    let editStatus = false;
    let id = '';

    if (projectForm !== null) {
      appController.callOnGetProjects((querySnapshot) => {
        projectTableBody.textContent = '';

        querySnapshot.forEach(doc => {
          const project = doc.data();
          const createDate = project.creationDate.toDate().toString().slice(0, 21);
          let lastDate;
          if (project.lastEdit != null) {
            lastDate = project.lastEdit.toDate().toString().slice(0, 21);
          } else {
            lastDate = "No edits";
          }

          const row = document.createElement('tr');

          const projectName = document.createElement('th');
          projectName.textContent = project.projectName;

          const projectOwner = document.createElement('td');
          projectOwner.textContent = project.projectOwner;

          const creationDate = document.createElement('td');
          creationDate.textContent = createDate;

          const lastEdit = document.createElement('td');
          lastEdit.textContent = lastDate;

          const projectTasks = document.createElement('td');
          const projectTasksButton = document.createElement('button');
          projectTasks.appendChild(projectTasksButton);
          projectTasksButton.setAttribute('data-id', doc.id);
          projectTasksButton.classList.add('btn', 'btn-primary', 'btn-projectTask');
          projectTasksButton.textContent = 'Tasks';

          const editProject = document.createElement('td');
          const editProjectButton = document.createElement('button');
          editProject.appendChild(editProjectButton);
          editProjectButton.setAttribute('data-id', doc.id);
          editProjectButton.setAttribute('data-bs-toggle', 'modal');
          editProjectButton.setAttribute('data-bs-target', '#createProjectModal');
          editProjectButton.classList.add('btn', 'btn-secondary', 'btn-edit');
          editProjectButton.textContent = 'Edit';

          const deleteProject = document.createElement('td');
          const deleteProjectButton = document.createElement('button');
          deleteProject.appendChild(deleteProjectButton);
          deleteProjectButton.setAttribute('data-id', doc.id);
          deleteProjectButton.classList.add('btn', 'btn-danger', 'btn-delete');
          deleteProjectButton.textContent = 'Delete';

          row.appendChild(projectName);
          row.appendChild(projectOwner);
          row.appendChild(creationDate);
          row.appendChild(lastEdit);
          row.appendChild(projectTasks);
          row.appendChild(editProject);
          row.appendChild(deleteProject);

          projectRowData.appendChild(row);
          projectTableBody.appendChild(projectRowData);
        });

        //Project tasks
        const btnsProjectTask = projectTableBody.querySelectorAll(".btn-projectTask");
        btnsProjectTask.forEach(btn => {
          btn.addEventListener('click', ({ target: { dataset } }) => {
            const projectId = dataset.id;

            //REDIRECT TO PROJECT TASKS
            this.displayProjectTasks(projectId);
            //window.location.href = 'tasks.html';
          })
        });

        //delete project
        const btnsDelete = projectTableBody.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
          btn.addEventListener('click', ({ target: { dataset } }) => {
            appController.callDeleteProject(dataset.id);
          });
        });

        //edit project
        const btnsEdit = projectTableBody.querySelectorAll(".btn-edit");
        btnsEdit.forEach(btn => {
          btn.addEventListener('click', ({ target: { dataset } }) => {
            const doc = appController.callGetProject(dataset.id);
            const project = doc.data();

            projectForm['project-title'].value = project.projectName;
            projectForm['project-owner'].value = project.projectOwner;
            projectForm['project-description'].value = project.description;

            editStatus = true;
            id = doc.id;
            projectForm['btn-project-save'].textContent = 'Update';
          });
        });
      });

      //submit or edit
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const projectName = projectForm['project-title'];
        const projectOwner = projectForm['project-owner'];
        const description = projectForm['project-description'];

        if (!editStatus) {
          const saveFields = {
            projectName: projectName.value,
            projectOwner: projectOwner.vlaue,
            description: description.value,
            creationDate: Timestamp.now()
          }
          appController.callSaveProject(saveFields);
        } else {
          const newFields = {
            projectName: projectName.value,
            projectOwner: projectOwner.value,
            description: description.value,
            lastEdit: Timestamp.now()
          }
          appController.callUpdateProject(id, newFields);
          editStatus = false;
          projectForm['btn-project-save'].textContent = 'Save';
        }
        projectForm.reset();
      });
    }
  }

  displayProjectTasks(projectId) {
    const displayProjects = document.querySelector('.display-projects');
    const displayProjectTasks = document.querySelector('.display-project-tasks');
    displayProjects.style.display = 'none'
    displayProjectTasks.style.display = 'block'
    //window.location.href = 'tasks.html'
    const taskForm = document.getElementById('task-form');
    const taskTableBody = document.getElementById('task-table-body');
    const taskRowData = document.createDocumentFragment();
    let editStatus = false;
    let id = '';

    let projectCollection = 'projects/';
    let tasksCollection = '/tasks';
    let location = projectCollection.concat(projectId, tasksCollection);

    appController.callGetTasksOfProjects(location, (querySnapshot) => {
      taskTableBody.textContent = '';
      querySnapshot.forEach(doc => {
        const task = doc.data();
        const dueDate = task.dueDate.toDate().toString().slice(0, 21);

        let row = document.createElement('tr');
        let taskName = document.createElement('th');
        let taskStatus = document.createElement('td');
        let taskPriority = document.createElement('td');
        let taskDue = document.createElement('td');
        let editTask = document.createElement('td');
        let editTaskButton = document.createElement('button');
        let deleteTask = document.createElement('td');
        let deleteTaskButton = document.createElement('button');

        taskName.textContent = task.title;
        taskStatus.textContent = task.status;
        taskPriority.textContent = task.priority;
        taskDue.textContent = dueDate;
        editTask.appendChild(editTaskButton);
        editTaskButton.setAttribute('data-id', doc.id);
        editTaskButton.setAttribute('data-bs-toggle', 'modal');
        editTaskButton.setAttribute('data-bs-target', '#createTaskModal');
        editTaskButton.classList.add('btn', 'btn-secondary', 'btn-edit');
        editTaskButton.textContent = 'Edit';
        deleteTask.appendChild(deleteTaskButton);
        deleteTaskButton.setAttribute('data-id', doc.id);
        deleteTaskButton.classList.add('btn', 'btn-primary', 'btn-delete');
        deleteTaskButton.textContent = 'Delete';

        row.appendChild(taskName);
        row.appendChild(taskStatus);
        row.appendChild(taskPriority);
        row.appendChild(taskDue);
        row.appendChild(editTask);
        row.appendChild(deleteTask);

        taskRowData.appendChild(row);
        taskTableBody.appendChild(taskRowData);

      });

      //delete task
      const btnsDelete = taskTableBody.querySelectorAll(".btn-delete")
      btnsDelete.forEach(btn => {
        btn.addEventListener('click', ({ target: { dataset } }) => {
          appController.callDeleteTask(dataset.id, location)//COULD BE WRONG
        })
      })

      //edit task
      const btnsEdit = taskTableBody.querySelectorAll(".btn-edit")
      btnsEdit.forEach(btn => {
        btn.addEventListener('click', ({ target: { dataset } }) => {
          const doc = appController.callGetTask(dataset.id, location);//SAME AS ABOVE^^
          const task = doc.data();

          taskForm['task-title'].value = task.title;
          taskForm['task-status'].value = task.status;
          taskForm['task-priority'].value = task.priority;
          taskForm['task-dueDate'].valueAsDate = task.dueDate;


          editStatus = true;
          id = doc.id;
          taskForm['btn-task-save'].textContent = 'Update';
        })
      })
    });

    //submit or edit
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const title = taskForm['task-title'];
      const status = taskForm['task-status'];
      const priority = taskForm['task-priority'];
      const dueDate = taskForm['task-dueDate'];


      if (!editStatus) {
        const taskData = {
          title: title.value,
          status: status.value,
          priority: priority.value,
          dueDate: dueDate.value,
          creationDate: Timestamp.now()
        }

        appController.callSaveTask(taskData, location);
      } else {
        const taskData = {
          title: title.value,
          status: status.value,
          priority: priority.value,
          dueDate: dueDate.valueAsDate,
          lastEdit: Timestamp.now()
        }

        appController.callUpdateTask(id, taskData, location);
        editStatus = false;
        taskForm['btn-task-save'].textContent = 'Save';
      }
      taskForm.reset()
    })
  }

}


// ------------------------------------Session--------------------------------
class Session {
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
    this.init();
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


// ------------------------------------CONTROLLER--------------------------------
class Controller {
  constructor(appSession, appView, appModel) {
    //authentication (is the user authenicated?, true/false) --> class session 
    //load index view if true
    //load register/login view if false
    //load view
    this.appSession = appSession;
    this.appView = appView;
    this.appModel = appModel;
  }
  init() {
    this.appSession.init();
  }

  //Authentication
  callRegisterUser(newUserData) {
    this.appSession.registerUser(newUserData);
  }

  callUserLogin(existingUserData) {
    this.appSession.userLogin(existingUserData);
  }

  callSaveUserData(user, firstName, lastName) {
    this.appModel.saveUserData(user, firstName, lastName);
  }

  callGoogleLogin() {
    this.appSession.googleLogin();
  }

  callUserLogout() {
    this.appSession.logoutSession();
  }

  //Session Start
  userAuthenticated() {
    this.appView.indexView();
  }

  userNotAuthenticated() {
    this.appView.init();
  }

  //Projects
  callOnGetProjects(callback) {
    this.appModel.onGetProjects(callback);
  }

  callSaveProject(saveFields) {
    this.appModel.saveProject(saveFields);
  }

  callGetProject(id) {
    this.appModel.getProject(id);
  }

  callDeleteProject(id) {
    this.appModel.deleteProject(id);
  }

  callUpdateProject(id, newFields) {
    this.appModel.updateProject(id, newFields);
  }

  //ProjectTasks
  callGetTasksOfProjects(location, callback) {
    this.appModel.getTasksofProjects(location, callback);
  }

  callDeleteTask(id, location) {
    this.appModel.deleteTask(id, location);
  }

  callGetTask(id, location) {
    this.appModel.getTask(id, location);
  }

  callSaveTask(taskData, location) {
    this.appModel.saveTask(taskData, location)
  }

  callUpdateTask(id, taskData, location) {
    this.appModel.updateTask(id, taskData, location)
  }

}

const appController = new Controller(new Session(), new View(), new Model());
appController.init()


