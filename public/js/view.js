import { Timestamp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { appController } from "./controller.js"

export class View {
  constructor() {
    this.statusDict = {
      0: 'Backlog',
      1: 'To-do',
      2: 'In progress',
      3: 'Completed'
    }

    this.priorityDict = {
      1: 'High',
      2: 'Medium',
      3: 'Low'
    }

    this.userRole = {
      0: 'Admin',
      1: 'Developer',
      2: 'Viewer',
    }
  }

  init() {
    //redirect to login if user is not authenticated
    if (!(window.location.toString().includes('login.html') || window.location.toString().includes('register.html'))) {
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

    //display current user
    const currentUserTag = document.getElementById('display-current-user');
    if (currentUserTag !== null) {
      const currentUserText = document.createElement('div');
      currentUserText.className = 'small';
      currentUserText.textContent = 'Logged in as: '
      currentUserTag.appendChild(currentUserText)
      const completeText = document.createTextNode(appController.appSession.user.displayName);
      currentUserTag.appendChild(completeText);
    }
  }

  sidebarLinks() {
    //redirect to respective methods if clicking on sidebar items
    const currentPage = document.body.id;
    switch (currentPage) {
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
      case 'tasks-page':
        this.displayTasks();
        break;
    }
  }

  displayDashboard() {
    //this.sidebarLinks();
    //render dashboard
    //google charts
    console.log('dashboard');
  }

  displayRoleAssignments() {
    console.log('roleAssignments');

    //populate user select
    const userSelectionForm = document.getElementById('user-role-select-form');
    const userSelection = document.getElementById('multiple-user-select');

    //populate Table
    const userTableBody = document.getElementById('user-table-body');
    const userRowData = document.createDocumentFragment();
    const location = 'users'

    appController.callGetDocumentSnapshot(location, (querySnapshot) => {
      userTableBody.textContent = '';
      userSelection.textContent = ''

      querySnapshot.forEach(docData => {
        const user = docData.data();
        let userRoleText
        if (user.role != null) {
          userRoleText = this.userRole[user.role];
        } else {
          userRoleText = 'No role assigned';
        }

        //table data
        const row = document.createElement('tr');

        const userName = document.createElement('th');
        userName.textContent = user.firstName + ' ' + user.lastName;

        const userEmail = document.createElement('td');
        userEmail.textContent = user.email;

        const userRole = document.createElement('td');
        userRole.textContent = userRoleText;

        //selection data
        const userOptionSelect = document.createElement('option');
        userOptionSelect.setAttribute('value', docData.id);
        userOptionSelect.textContent = user.firstName + ' ' + user.lastName;

        row.appendChild(userName);
        row.appendChild(userEmail);
        row.appendChild(userRole);

        userSelection.appendChild(userOptionSelect);

        userRowData.appendChild(row);
        userTableBody.appendChild(userRowData);

      });

    });

    //confirmation button


    //submit button
    const roleSelect = document.getElementById('role-select');
    userSelectionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userSelectedArray = [];
      const userOptions = userSelection.options;

      //selected users
      for (var i = 0; i < userOptions.length; i++) {
        const currentOption = userOptions[i];
        if (currentOption.selected) {
          userSelectedArray.push(currentOption.value);
        }
      }
      //selected role
      const userRole = userSelectionForm['role-select'];

      //save new role (newfields) for each id
      userSelectedArray.forEach(id => {
        const newFields = {
          role: parseInt(userRole.value)
        }
        appController.callUpdateDocument(id, newFields, location)
      })

      userRole.selectedIndex = '';
    })

  }

  displayProjectTeams() {
    console.log('projectTeams');

    const teamForm = document.getElementById('team-form');
    const teamTableBody = document.getElementById('team-table-body');
    const teamRowData = document.createDocumentFragment();
    let id = '';
    const location = 'projects'
    let noMembers = true;
    let addMembers = true;

    appController.callGetDocumentSnapshot(location, (querySnapshot) => {
      teamTableBody.textContent = '';

      querySnapshot.forEach(docData => {
        const project = docData.data();

        const row = document.createElement('tr');

        const projectName = document.createElement('th');
        projectName.textContent = project.projectName;

        const projectOwner = document.createElement('td');

        appController.callGetDocument(project.projectOwner, 'users').then(userData => {
          const user = userData.data();
          projectOwner.textContent = user.firstName + ' ' + user.lastName;
        })

        //check current members
        const projectTeam = document.createElement('td');
        if (Object.values(project.team).some(val => val === true)) {
          for (const key in project.team) {
            if (project.team[key] == true) {
              appController.callGetDocument(key, 'users').then(userData => {
                const user = userData.data();
                const currentMember = document.createElement('p');
                currentMember.textContent = user.firstName + ' ' + user.lastName;
                projectTeam.appendChild(currentMember);
              })
            }
          }
        } else {
          //initialize member data
          projectTeam.textContent = 'No members assigned to this project yet.';
        }

        const addMember = document.createElement('td');
        const addMemberButton = document.createElement('button');
        addMember.appendChild(addMemberButton);
        addMemberButton.setAttribute('data-id', docData.id);
        addMemberButton.setAttribute('data-bs-toggle', 'modal');
        addMemberButton.setAttribute('data-bs-target', '#add-remove-modal');
        addMemberButton.classList.add('btn', 'btn-primary', 'btn-addMember');
        addMemberButton.textContent = 'Add';

        const removeMember = document.createElement('td');
        const removeMemberButton = document.createElement('button');
        removeMember.appendChild(removeMemberButton);
        removeMemberButton.setAttribute('data-id', docData.id);
        removeMemberButton.setAttribute('data-bs-toggle', 'modal');
        removeMemberButton.setAttribute('data-bs-target', '#add-remove-modal');
        removeMemberButton.classList.add('btn', 'btn-danger', 'btn-removeMember');
        removeMemberButton.textContent = 'Remove';

        row.appendChild(projectName);
        row.appendChild(projectOwner);
        row.appendChild(projectTeam);
        row.appendChild(addMember);
        row.appendChild(removeMember);

        teamRowData.appendChild(row);
        teamTableBody.appendChild(teamRowData);
      });

      //Add Member
      const btnsAdd = teamTableBody.querySelectorAll(".btn-addMember");
      btnsAdd.forEach(btn => {
        btn.addEventListener('click', async ({ target: { dataset } }) => {
          const docData = await appController.callGetDocument(dataset.id, location);
          const project = docData.data();
          const userData = await appController.callGetDocument(project.projectOwner, 'users');
          let ownerId = userData.id;

          teamForm['project-title'].value = project.projectName;

          //create/update team map if it doesnt exist
          const projectTeamSelection = document.getElementById('project-team');
          const projectMap = project.team;

          //users snapshot
          const projectOwnerSelection = document.getElementById('project-owner');

          appController.callGetDocumentSnapshot('users', (querySnapshot) => {
            projectOwnerSelection.textContent = '';
            projectTeamSelection.textContent = '';

            querySnapshot.forEach(userDocData => { //for each user currently in the db...
              const currentUser = userDocData.data();
              const userId = userDocData.id;
              const userName = currentUser.firstName + ' ' + currentUser.lastName;

              //create owner tag
              const optionData = document.createElement('option');
              optionData.setAttribute('value', userId);
              if (userId == ownerId) {
                optionData.selected = true;
              } else {
                optionData.selected = false;
              }
              optionData.textContent = userName;
              projectOwnerSelection.appendChild(optionData);

              if (userId in projectMap && projectMap[userId] == false) { //if user is not already on the team...
                //console.log(userName, 'not in team');
                const teamOption = document.createElement('option');
                teamOption.setAttribute('value', userId);
                teamOption.textContent = userName;
                projectTeamSelection.appendChild(teamOption);
                //console.log(projectTeamSelection);
              } else if (!(userId in projectMap)) {
                //user not in map
                console.log(userName, 'not in map');
              }

            })

          });
          //projectOwnerSelection.appendChild(userSelectData);
          //console.log(userSelectData);
          //teamForm['project-owner'].value = user.firstName + ' ' + user.lastName;

          id = docData.id;
          teamForm['btn-team-save'].classList.add('btn-primary');
          teamForm['btn-team-save'].textContent = 'Add Member';
        });
      });

      //Remove Member
      const btnsRemove = teamTableBody.querySelectorAll(".btn-removeMember");
      btnsRemove.forEach(btn => {
        btn.addEventListener('click', async ({ target: { dataset } }) => {
          const docData = await appController.callGetDocument(dataset.id, location);
          const project = docData.data();
          const userData = await appController.callGetDocument(project.projectOwner, 'users');
          let ownerId = userData.id;
          addMembers = false;

          teamForm['project-title'].value = project.projectName;

          //create/update team map if it doesnt exist
          const projectTeamSelection = document.getElementById('project-team');
          const projectMap = project.team;

          //users snapshot
          const projectOwnerSelection = document.getElementById('project-owner');

          appController.callGetDocumentSnapshot('users', (querySnapshot) => {
            projectOwnerSelection.textContent = '';
            projectTeamSelection.textContent = '';

            querySnapshot.forEach(userDocData => { //for each user currently in the db...
              const currentUser = userDocData.data();
              const userId = userDocData.id;
              const userName = currentUser.firstName + ' ' + currentUser.lastName;

              //create owner tag
              const optionData = document.createElement('option');
              optionData.setAttribute('value', userId);
              if (userId == ownerId) {
                optionData.selected = true;
              } else {
                optionData.selected = false;
              }
              optionData.textContent = userName;
              projectOwnerSelection.appendChild(optionData);

              if (userId in projectMap && projectMap[userId] == true) { //if user is already on the team...
                //console.log(userName, 'not in team');
                const teamOption = document.createElement('option');
                teamOption.setAttribute('value', userId);
                teamOption.textContent = userName;
                projectTeamSelection.appendChild(teamOption);
                //console.log(projectTeamSelection);
              } else if (!(userId in projectMap)) {
                //user not in map
                console.log(userName, 'not in map');
              }

            })

          });
          //projectOwnerSelection.appendChild(userSelectData);
          //console.log(userSelectData);
          //teamForm['project-owner'].value = user.firstName + ' ' + user.lastName;

          id = docData.id;
          teamForm['btn-team-save'].classList.add('btn-danger');
          teamForm['btn-team-save'].textContent = 'Remove Member';
        });
      });
    });

    //add members or rmeove?
    teamForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const projectOwner = teamForm['project-owner'];
      const projectTeam = teamForm['project-team'];
      const teamModal = document.getElementById('add-remove-modal');
      const modal = bootstrap.Modal.getInstance(teamModal);

      let newFields;

      if (addMembers) {
        newFields = {
          projectOwner: projectOwner.value,
          [`team.${projectTeam.value}`]: true,
          editedBy: appController.appSession.user.uid,
          lastEdit: Timestamp.now()
        };
        teamForm['btn-team-save'].classList.remove('btn-primary');
      } else {
        //change key value pair to false
        newFields = {
          projectOwner: projectOwner.value,
          [`team.${projectTeam.value}`]: false,
          editedBy: appController.appSession.user.uid,
          lastEdit: Timestamp.now()
        };
        teamForm['btn-team-save'].classList.remove('btn-danger');
      }

      teamForm
      //console.log(newFields);
      //console.log(id);
      //console.log(location);
      appController.callUpdateDocument(id, newFields, location);

      teamForm.reset();
      modal.hide();
    });
  }

  displayProjects() {
    console.log('projects!');

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

          appController.callGetDocument(project.projectOwner, 'users').then(userData => {
            const user = userData.data();
            projectOwner.textContent = user.firstName + ' ' + user.lastName;
          })

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
          btn.addEventListener('click', async ({ target: { dataset } }) => {
            const docData = await appController.callGetDocument(dataset.id, location);
            const project = docData.data();
            const userData = await appController.callGetDocument(project.projectOwner, 'users');
            const user = userData.data();

            projectForm['project-title'].value = project.projectName;
            projectForm['project-owner'].value = user.firstName + ' ' + user.lastName;
            projectForm['project-description'].value = project.description;

            editStatus = true;
            id = docData.id;
            projectForm['btn-project-save'].textContent = 'Update';

          });
        });
      });

      //submit or edit
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const projectName = projectForm['project-title'];
        const description = projectForm['project-description'];
        const projectModal = document.getElementById('createProjectModal');
        const modal = bootstrap.Modal.getInstance(projectModal);

        if (!editStatus) {
          const saveFields = {
            projectName: projectName.value,
            projectOwner: appController.appSession.user.uid,
            description: description.value,
            createdBy: appController.appSession.user.uid,
            creationDate: Timestamp.now()
          }
          appController.callSaveDocument(saveFields, location);
        } else {
          const newFields = {
            projectName: projectName.value,
            description: description.value,
            editedBy: appController.appSession.user.uid,
            lastEdit: Timestamp.now()
          }
          appController.callUpdateDocument(id, newFields, location);
          editStatus = false;
          projectForm['btn-project-save'].textContent = 'Save';
        }
        projectForm.reset();
        modal.hide();
      });
    }
  }

  displayProjectTasks(projectId) {
    const displayProjects = document.getElementById('display-projects');
    const displayProjectTasks = document.getElementById('display-project-tasks');
    displayProjects.style.display = 'none'
    displayProjectTasks.style.display = 'block'

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
        const dueDate = task.dueDate.toDate().toString().slice(0, 16);

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
        taskStatus.textContent = this.statusDict[task.status];
        taskPriority.textContent = this.priorityDict[task.priority];
        taskDue.textContent = dueDate;
        editTask.appendChild(editTaskButton);
        editTaskButton.setAttribute('data-id', docData.id);
        editTaskButton.setAttribute('data-bs-toggle', 'modal');
        editTaskButton.setAttribute('data-bs-target', '#createTaskModal');
        editTaskButton.classList.add('btn', 'btn-secondary', 'btn-edit');
        editTaskButton.textContent = 'Edit';
        deleteTask.appendChild(deleteTaskButton);
        deleteTaskButton.setAttribute('data-id', docData.id);
        deleteTaskButton.classList.add('btn', 'btn-danger', 'btn-delete');
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
        btn.addEventListener('click', async ({ target: { dataset } }) => {
          const docData = await appController.callGetDocument(dataset.id, location);
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
      const dueDate = taskForm['task-dueDate'].valueAsDate;
      const taskModal = document.getElementById('createTaskModal');
      const modal = bootstrap.Modal.getInstance(taskModal);

      const dateFix = new Date(dueDate.setHours(dueDate.getHours() + 5)); //get rid of the -5 date offset

      if (!editStatus) {
        const taskData = {
          title: title.value,
          status: parseInt(status.value),
          priority: parseInt(priority.value),
          dueDate: dateFix,
          createdBy: appController.appSession.user.uid,
          creationDate: Timestamp.now()
        }

        appController.callSaveDocument(taskData, location);
      } else {
        const taskData = {
          title: title.value,
          status: parseInt(status.value),
          priority: parseInt(priority.value),
          dueDate: dateFix,
          editedBy: appController.appSession.user.uid,
          lastEdit: Timestamp.now()
        }

        appController.callUpdateDocument(id, taskData, location);
        editStatus = false;
        taskForm['btn-task-save'].textContent = 'Save';
      }
      taskForm.reset();
      modal.hide();
    })
  }

  displayTasks() {
    console.log('tasks');
  }
}
