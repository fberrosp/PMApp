import { Timestamp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { appController } from "./controller.js"
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

export class View {
    constructor() {
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
          const newUserData = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password
          }
          appController.callRegisterUser(newUserData);
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
          const existingUserData = {
            email: email,
            password: password
          }
          appController.callUserLogin(existingUserData);
          loginForm.reset();
        })
      }
    }
  
    indexView() {
      //redirect to index if user is authenticated
      if (window.location.toString().includes('login.html') || window.location.toString().includes('register.html')) {
        window.location.href = 'index.html'
      }
      
      this.sidebarLinks();
  
      //listen to logout
      const logout = document.querySelector('#logout-button');
      if (logout !== null) {
        logout.addEventListener('click', e => {
          e.preventDefault();
          appController.callUserLogout();
        })
      }
    }

    sidebarLinks(){
      //redirect to respective methods if clicking on sidebar items
      const currentPage = document.body.id;
      switch(currentPage){
        case 'index-page':
          this.displayDashboard();
          break;
        case 'roleAssignments-page':
          this.displayRoleAssignments();
          break;
        case 'projectTeams-page':
          this.displayProjectTeams();
          break;
        case 'projects-page':
          this.displayProjects();
          break;
        case 'epics-page':
          this.displayEpics();
          break;
        case 'tasks-page':
          this.displayTasks();
          break;
      }
    }

    displayDashboard(){
      //this.sidebarLinks();
      //render dashboard
      //google charts
      console.log('dashboard');
    }

    displayRoleAssignments(){
      console.log('roleAssignments');
    }

    displayProjectTeams(){
      console.log('projectTeams');
    }
  
    displayProjects() {
      const displayProjects = document.getElementById('display-projects');
      const displayProjectTasks = document.getElementById('display-project-tasks');
      displayProjects.style.display = 'block'
      displayProjectTasks.style.display = 'none'
  
      const projectForm = document.getElementById('project-form');
      const projectTableBody = document.getElementById('project-table-body');
      const projectRowData = document.createDocumentFragment();
      let editStatus = false;
      let id = '';
      const location = 'projects'
  
      if (projectForm !== null) {
        appController.callGetDocumentSnapshot(location, (querySnapshot) => {
          projectTableBody.textContent = '';
  
          querySnapshot.forEach(docData => {
            const project = docData.data();
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
            projectTasksButton.setAttribute('data-id', docData.id);
            projectTasksButton.classList.add('btn', 'btn-primary', 'btn-projectTask');
            projectTasksButton.textContent = 'Tasks';
  
            const editProject = document.createElement('td');
            const editProjectButton = document.createElement('button');
            editProject.appendChild(editProjectButton);
            editProjectButton.setAttribute('data-id', docData.id);
            editProjectButton.setAttribute('data-bs-toggle', 'modal');
            editProjectButton.setAttribute('data-bs-target', '#createProjectModal');
            editProjectButton.classList.add('btn', 'btn-secondary', 'btn-edit');
            editProjectButton.textContent = 'Edit';
  
            const deleteProject = document.createElement('td');
            const deleteProjectButton = document.createElement('button');
            deleteProject.appendChild(deleteProjectButton);
            deleteProjectButton.setAttribute('data-id', docData.id);
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
              appController.callDeleteDocument(dataset.id, location);
            });
          });
  
          //edit project
          const btnsEdit = projectTableBody.querySelectorAll(".btn-edit");
          btnsEdit.forEach(btn => {
            btn.addEventListener('click',  ({ target: { dataset } }) => {
              const docData =  appController.callGetDocument(dataset.id, location).then((result) => {
                console.log("view", result);
                const project = result.data();
                
                projectForm['project-title'].value = project.projectName;
                projectForm['project-owner'].value = project.projectOwner;
                projectForm['project-description'].value = project.description;
    
                editStatus = true;
                id = result.id;
                projectForm['btn-project-save'].textContent = 'Update';
                //const docData = await getDoc(doc(appController.appSession.db, location, dataset.id));
              }).catch((err) => {
                console.log(err);
              });


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
            appController.callSaveDocument(saveFields, location);
          } else {
            const newFields = {
              projectName: projectName.value,
              projectOwner: projectOwner.value,
              description: description.value,
              lastEdit: Timestamp.now()
            }
            appController.callUpdateDocument(id, newFields, location);
            editStatus = false;
            projectForm['btn-project-save'].textContent = 'Save';
          }
          projectForm.reset();
        });
      }
    }

    displayProjectTasks(projectId) {
      const displayProjects = document.getElementById('display-projects');
      const displayProjectTasks = document.getElementById('display-project-tasks');
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
  
      appController.callGetDocumentSnapshot(location, (querySnapshot) => {
        taskTableBody.textContent = '';
        querySnapshot.forEach(docData => {
          const task = docData.data();
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
          editTaskButton.setAttribute('data-id', docData.id);
          editTaskButton.setAttribute('data-bs-toggle', 'modal');
          editTaskButton.setAttribute('data-bs-target', '#createTaskModal');
          editTaskButton.classList.add('btn', 'btn-secondary', 'btn-edit');
          editTaskButton.textContent = 'Edit';
          deleteTask.appendChild(deleteTaskButton);
          deleteTaskButton.setAttribute('data-id', docData.id);
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
            appController.callDeleteDocument(dataset.id, location)
          })
        })
  
        //edit task
        const btnsEdit = taskTableBody.querySelectorAll(".btn-edit")
        btnsEdit.forEach(btn => {
          btn.addEventListener('click', ({ target: { dataset } }) => {

            const docData = appController.callGetDocument(dataset.id, location);
            console.log(docData)
            const task = docData.data();
  
            taskForm['task-title'].value = task.title;
            taskForm['task-status'].value = task.status;
            taskForm['task-priority'].value = task.priority;
            taskForm['task-dueDate'].valueAsDate = task.dueDate;
  
  
            editStatus = true;
            id = docData.id;
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
            dueDate: dueDate.valueAsDate,
            creationDate: Timestamp.now()
          }
  
          appController.callSaveDocument(taskData, location);
        } else {
          const taskData = {
            title: title.value,
            status: status.value,
            priority: priority.value,
            dueDate: dueDate.valueAsDate,
            lastEdit: Timestamp.now()
          }
  
          appController.callUpdateDocument(id, taskData, location);
          editStatus = false;
          taskForm['btn-task-save'].textContent = 'Save';
        }
        taskForm.reset()
      })
    }

    displayEpics(){
      console.log('epics');
    }

    displayTasks(){
      console.log('tasks');
    }
  }
  