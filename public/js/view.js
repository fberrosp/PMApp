import { Timestamp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { appController } from "./controller.js"

export class View {
  constructor() {
    this.statusDict = {
      0: 'Backlog',
      1: 'To-do',
      2: 'In progress',
      3: 'Completed',
      4: 'On hold',
      5: 'Cancelled'
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
    //redirect to index if role

    appController.callGetDocument(appController.appSession.user.uid, 'users').then(userData => {
      const user = userData.data();
      this.currentUserRole = user.role;

      if (this.currentUserRole && (window.location.toString().includes('login.html') || window.location.toString().includes('register.html'))) {
        window.location.href = 'index.html'
      }
    })

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
    const location = 'users';

    const sortField = 'lastLogin';
    const sortBy = 'desc';

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

    }, sortField, sortBy);

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
    let addMembers = true;

    const sortField = 'creationDate';
    const sortBy = 'desc';

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

        //DETAILS BUTTON
        const teamDetails = document.createElement('td');
        const teamDetailsButton = document.createElement('button');
        teamDetails.appendChild(teamDetailsButton);
        teamDetailsButton.setAttribute('data-id', docData.id);
        teamDetailsButton.classList.add('btn', 'btn-secondary', 'btn-projectTask');
        teamDetailsButton.textContent = 'Details';

        row.appendChild(projectName);
        row.appendChild(projectOwner);
        row.appendChild(projectTeam);
        row.appendChild(teamDetails);

        teamRowData.appendChild(row);
        teamTableBody.appendChild(teamRowData);
      });

      //Project team details button (change to link)
      const btnsProjectTeamsDetails = teamTableBody.querySelectorAll(".btn-projectTask");
      btnsProjectTeamsDetails.forEach(btn => {
        btn.addEventListener('click', ({ target: { dataset } }) => {
          const projectId = dataset.id;

          //REDIRECT TO PROJECT TASKS
          this.displayProjectTeamsDetails(projectId);
        })
      });

    }, sortField, sortBy);

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

  displayProjectTeamsDetails(projectId) {
    console.log('project team details!');

    const displayTeams = document.getElementById('display-teams');
    const displayTeamDetails = document.getElementById('display-team-details');
    const breadcumbsTeams = document.getElementById('breadcrumbs-teams');
    displayTeams.style.display = 'none'
    displayTeamDetails.style.display = 'block'
    breadcumbsTeams.style.display = 'block'

    const projectBreadcrumb = document.getElementById('project-breadcrumb');
    const projectForm = document.getElementById('project-form');
    const usersInTeamSelect = document.getElementById('user-in-team-select');
    const usersNotInTeamSelect = document.getElementById('user-not-in-team-select');
    const projectOwnerSelect = document.getElementById('project-owner');

    const location = 'projects';

    appController.callGetDocument(projectId, location).then(project => {
      usersInTeamSelect.textContent = '';
      usersNotInTeamSelect.textContent = '';
      projectOwnerSelect.textContent = '';

      const projectData = project.data();

      projectForm['project-title'].value = projectData.projectName;
      projectBreadcrumb.textContent = projectData.projectName;

      //call document snapshot
      const sortField = 'lastLogin';
      const sortBy = 'desc';
      appController.callGetDocumentSnapshot('users', (users) => {
        users.forEach(user => {
          const userData = user.data()
          //for each user create an opttion
          const userOption = document.createElement('option');
          userOption.value = user.id;
          userOption.textContent = userData.firstName + ' ' + userData.lastName;

          //if user is project owner, make him the selected option
          if (user.id == projectData.projectOwner) {
            userOption.selected = true;
          }

          projectOwnerSelect.appendChild(userOption);
        });
      }, sortField, sortBy);

      //loop through team attribute to find who is on team and whos not
      const allUsers = projectData.team;
      for (const key in allUsers) {
        const currentUserOption = document.createElement('option');
        currentUserOption.value = key;

        appController.callGetDocument(key, 'users').then(userData => {
          const user = userData.data();
          currentUserOption.textContent = user.firstName + ' ' + user.lastName;
        });

        if (allUsers[key]) {
          usersInTeamSelect.appendChild(currentUserOption); //create user in team selection
        } else {
          usersNotInTeamSelect.appendChild(currentUserOption); //create user not in team selection
        }
      }
    });

    //add member
    const addMemberButton = document.getElementById('btn-add-user');
    addMemberButton.addEventListener('click', (e) => {
      const userOptions = usersNotInTeamSelect.options;
      //console.log(userOptions);

      //selected users
      const selectedUsers = {};
      for (var i = 0; i < userOptions.length; i++) {
        const currentOption = userOptions[i];
        if (currentOption.selected) {
          selectedUsers[currentOption.value] = currentOption.textContent;
          userOptions[i].remove();
          i = i - 1;
        }
      }

      //move it to opposite box 
      Object.keys(selectedUsers).forEach(key => {
        const addNewUser = document.createElement('option');
        addNewUser.value = key;
        addNewUser.textContent = selectedUsers[key];
        usersInTeamSelect.appendChild(addNewUser);
      });
    });

    //remove member
    const removeMemberButton = document.getElementById('btn-remove-user');
    removeMemberButton.addEventListener('click', (e) => {
      const userOptions = usersInTeamSelect.options;
      //console.log(userOptions);

      //selected users
      const selectedUsers = {};
      for (var i = 0; i < userOptions.length; i++) {
        const currentOption = userOptions[i];
        if (currentOption.selected) {
          selectedUsers[currentOption.value] = currentOption.textContent;
          userOptions[i].remove();
          i = i - 1;
        }
      }

      Object.keys(selectedUsers).forEach(key => {
        const addNewUser = document.createElement('option');
        addNewUser.value = key;
        addNewUser.textContent = selectedUsers[key];
        usersNotInTeamSelect.appendChild(addNewUser);
      });
    });

    //save contents
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      //get users not in team
      const usersNotInTeamOptions = usersNotInTeamSelect.options;
      const usersInTeamOptions = usersInTeamSelect.options;

      const newData = {};

      for (var i = 0; i < usersNotInTeamOptions.length; i++) {
        const currentOption = usersNotInTeamOptions[i];
        newData[currentOption.value] = false;
      }

      for (var i = 0; i < usersInTeamOptions.length; i++) {
        const currentOption = usersInTeamOptions[i];
        newData[currentOption.value] = true;
      }

      const newFields = {
        team: newData
      }

      appController.callUpdateDocument(projectId, newFields, location);
      console.log('team updated!');
      projectForm.reset();
      displayTeams.style.display = 'block';
      displayTeamDetails.style.display = 'none';
      breadcumbsTeams.style.display = 'none';

    });

    //cancel
    const cancelBtn = document.getElementById('btn-team-cancel');
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      projectForm.reset();
      displayTeams.style.display = 'block';
      displayTeamDetails.style.display = 'none';
      breadcumbsTeams.style.display = 'none';
    })

  }

  displayProjects() {
    console.log('projects!');

    const displayProjects = document.getElementById('display-projects');
    const displayProjectTasks = document.getElementById('display-project-tasks');
    displayProjects.style.display = 'block'
    displayProjectTasks.style.display = 'none'

    const projectFormModal = document.getElementById('project-form-modal');
    const projectTableBody = document.getElementById('project-table-body');
    const projectRowData = document.createDocumentFragment();
    const location = 'projects'

    const sortField = 'creationDate';
    const sortBy = 'desc';

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

        const projectDetailsAndTask = document.createElement('td');
        const projectList = document.createElement('ul');
        projectDetailsAndTask.appendChild(projectList);

        const projectListFirst = document.createElement('li');
        projectList.appendChild(projectListFirst);

        const projectDetailsTag = document.createElement('p');
        projectListFirst.appendChild(projectDetailsTag);

        const projectDetailsLink = document.createElement('a');
        projectDetailsTag.appendChild(projectDetailsLink);

        projectDetailsLink.setAttribute('data-id', docData.id);
        projectDetailsLink.href = '#';
        projectDetailsLink.classList.add('btn-projectDetails');
        projectDetailsLink.textContent = 'Details';

        const projectListSecond = document.createElement('li');
        projectList.appendChild(projectListSecond);

        const projectTaskTag = document.createElement('p');
        projectListSecond.appendChild(projectTaskTag);

        const projectTaskLink = document.createElement('a');
        projectTaskTag.appendChild(projectTaskLink);

        projectTaskLink.href = '#';
        projectTaskLink.setAttribute('data-id', docData.id);
        projectTaskLink.classList.add('btn-projectTask');
        projectTaskLink.textContent = 'Tasks';

        row.appendChild(projectName);
        row.appendChild(projectOwner);
        row.appendChild(projectDetailsAndTask);

        projectRowData.appendChild(row);
        projectTableBody.appendChild(projectRowData);
      });

      //Project details
      const btnsProjectDetails = projectTableBody.querySelectorAll(".btn-projectDetails");
      btnsProjectDetails.forEach(btn => {
        btn.addEventListener('click', ({ target: { dataset } }) => {
          const projectId = dataset.id;

          //REDIRECT TO PROJECT TASKS
          this.displayProjectDetails(projectId);
        })
      });

      //Project tasks
      const btnsProjectTask = projectTableBody.querySelectorAll(".btn-projectTask");
      btnsProjectTask.forEach(btn => {
        btn.addEventListener('click', ({ target: { dataset } }) => {
          const projectId = dataset.id;

          //REDIRECT TO PROJECT TASKS
          this.displayProjectTasks(projectId);
        })
      });
    }, sortField, sortBy);

  }

  displayProjectDetails(projectId) {
    console.log('in projectDetails!');

    const displayProjects = document.getElementById('display-projects');
    const displayProjectTasks = document.getElementById('display-project-tasks');
    const breadcumbsTeams = document.getElementById('breadcrumbs-teams');
    const projectBreadcrumb = document.getElementById('project-breadcrumb');
    const projectDetails = document.getElementById('display-project-details');
    projectDetails.style.display = 'block';
    displayProjects.style.display = 'none';
    displayProjectTasks.style.display = 'none';
    breadcumbsTeams.style.display = 'block';

    const projectForm = document.getElementById('project-form');
    const projectTeam = document.getElementById('project-team');
    const projectOwnerSelect = document.getElementById('project-owner');

    const location = 'projects';

    appController.callGetDocument(projectId, location).then(project => {
      projectTeam.textContent = '';
      const projectData = project.data();
      //console.log(projectData);
      //console.log(projectData.projectName);
      projectForm['project-title'].value = projectData.projectName;
      projectBreadcrumb.textContent = projectData.projectName;

      //call document snapshot

      const sortField = 'lastLogin';
      const sortBy = 'desc';
      appController.callGetDocumentSnapshot('users', (users) => {
        users.forEach(user => {
          const userData = user.data()
          //for each user create an opttion
          const userOption = document.createElement('option');
          userOption.value = user.id;
          userOption.textContent = userData.firstName + ' ' + userData.lastName;

          //if user is project owner, make him the selected option
          if (user.id == projectData.projectOwner) {
            userOption.selected = true;
          }

          projectOwnerSelect.appendChild(userOption);
        });
      }, sortField, sortBy);

      projectForm['project-description'].value = projectData.description;


      //loop through team attribute to write team
      const allUsers = projectData.team;

      for (const key in allUsers) {
        if (allUsers[key]) {
          //create team options
          const currentUserOption = document.createElement('option');
          currentUserOption.value = key;

          appController.callGetDocument(key, 'users').then(userData => {
            const user = userData.data();
            currentUserOption.textContent = user.firstName + ' ' + user.lastName;
          });

          projectTeam.appendChild(currentUserOption);
        }
      }

    });

    //Admin
    if (this.currentUserRole == 0) {
      const editBtn = document.getElementById('btn-project-edit');
      editBtn.style.display = 'block';

      const cancelBtn = document.getElementById('btn-project-cancel');
      const saveBtn = document.getElementById('btn-project-save');

      //Edit
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();

        projectForm['project-title'].disabled = false;
        projectForm['project-owner'].disabled = false;
        projectForm['project-description'].disabled = false;
        projectForm['project-team'].disabled = false;

        cancelBtn.style.display = 'block';
        saveBtn.style.display = 'block';
        editBtn.style.display = 'none';
      });

      //Cancel
      cancelBtn.addEventListener('click', (e) => {
        console.log('in cancel');

        projectForm['project-title'].disabled = true;
        projectForm['project-owner'].disabled = true;
        projectForm['project-description'].disabled = true;
        projectForm['project-team'].disabled = true;

        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        editBtn.style.display = 'block';
      });

      //Submit
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = projectForm['project-title'].value;
        const owner = projectForm['project-owner'].value;
        const description = projectForm['project-description'].value;

        const projectData = {
          projectName: title,
          projectOwner: owner,
          description: description,
          lastEdit: Timestamp.now()
        }

        appController.callUpdateDocument(projectId, projectData, location);
        console.log('project information udpated!');

        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        editBtn.style.display = 'block';

        projectForm['project-title'].disabled = true;
        projectForm['project-owner'].disabled = true;
        projectForm['project-description'].disabled = true;
        projectForm['project-team'].disabled = true;

        projectDetails.style.display = 'none';
        displayProjects.style.display = 'block';
        displayProjectTasks.style.display = 'none';
        breadcumbsTeams.style.display = 'none';

      })
    }

  }

  displayProjectTasks(projectId) {
    console.log('in projectTasks!');

    const displayProjects = document.getElementById('display-projects');
    const displayProjectTasks = document.getElementById('display-project-tasks');
    const breadcumbsTeams = document.getElementById('breadcrumbs-teams');
    const projectBreadcrumb = document.getElementById('project-breadcrumb');
    const projectDetails = document.getElementById('display-project-details');
    projectDetails.style.display = 'none';
    displayProjects.style.display = 'none';
    displayProjectTasks.style.display = 'block';
    breadcumbsTeams.style.display = 'block';

    const taskForm = document.getElementById('task-form');
    const taskTableBody = document.getElementById('task-table-body');
    const taskRowData = document.createDocumentFragment();

    const projectCollection = 'projects/';
    const tasksCollection = '/tasks';
    const location = projectCollection.concat(projectId, tasksCollection);

    const sortField = 'creationDate';
    const sortBy = 'desc';

    let toBeEdited = false;
    let id = '';

    appController.callGetDocumentSnapshot(location, (querySnapshot) => {

      taskTableBody.textContent = '';
      querySnapshot.forEach(docData => {
        const task = docData.data();
        const dueDate = task.dueDate.toDate().toString().slice(0, 16);

        let startDate;
        if (task.startDate == null) {
          startDate = dueDate;
        } else {
          startDate = task.startDate.toDate().toString().slice(0, 16);
        }

        const row = document.createElement('tr');

        const taskName = document.createElement('th');
        taskName.textContent = task.title;

        const taskStatus = document.createElement('td');
        taskStatus.textContent = this.statusDict[task.status];

        const taskPriority = document.createElement('td');
        taskPriority.textContent = this.priorityDict[task.priority];

        const taskStart = document.createElement('td');
        taskStart.textContent = startDate;

        const taskDue = document.createElement('td');
        taskDue.textContent = dueDate;

        const taskDetails = document.createElement('td');
        const taskDetailsTag = document.createElement('p');
        taskDetails.appendChild(taskDetailsTag);

        const taskDetailsLink = document.createElement('a');
        taskDetailsTag.appendChild(taskDetailsLink);

        taskDetailsLink.setAttribute('data-id', docData.id);
        taskDetailsLink.href = '#';
        taskDetailsLink.classList.add('btn-taskDetails');
        taskDetailsLink.setAttribute('data-bs-toggle', 'modal');
        taskDetailsLink.setAttribute('data-bs-target', '#createTaskModal');
        taskDetailsLink.textContent = 'Details';

        const editTask = document.createElement('td');
        const editTaskButton = document.createElement('button');
        editTask.appendChild(editTaskButton);
        editTaskButton.setAttribute('data-id', docData.id);
        editTaskButton.setAttribute('data-bs-toggle', 'modal');
        editTaskButton.setAttribute('data-bs-target', '#createTaskModal');
        editTaskButton.classList.add('btn', 'btn-secondary', 'btn-edit');
        editTaskButton.textContent = 'Edit';

        const deleteTask = document.createElement('td');
        const deleteTaskButton = document.createElement('button');
        deleteTask.appendChild(deleteTaskButton);
        deleteTaskButton.setAttribute('data-id', docData.id);
        deleteTaskButton.classList.add('btn', 'btn-danger', 'btn-delete');
        deleteTaskButton.textContent = 'Delete';

        appController.callGetDocument(projectId, 'projects').then(projectData => {
          const project = projectData.data();
          projectBreadcrumb.textContent = project.projectName;
        })
        row.appendChild(taskName);
        row.appendChild(taskStatus);
        row.appendChild(taskPriority);
        row.appendChild(taskStart);
        row.appendChild(taskDue);
        row.appendChild(taskDetails);

        taskRowData.appendChild(row);
        taskTableBody.appendChild(taskRowData);
      });

      const taskModal = document.getElementById('createTaskModal');
      const modal = bootstrap.Modal.getInstance(taskModal);

      //Task Details
      const btnsTaskDetails = taskTableBody.querySelectorAll(".btn-taskDetails");
      btnsTaskDetails.forEach(btn => {
        btn.addEventListener('click', async ({ target: { dataset } }) => {

          const editBtn = document.getElementById('btn-task-edit');
          const cancelBtn = document.getElementById('btn-task-cancel');
          const saveBtn = document.getElementById('btn-task-save');
          editBtn.style.display = 'block';
          cancelBtn.style.display = 'none';
          saveBtn.style.display = 'none';

          //open task details modal and if admin, show delete button
          const docData = await appController.callGetDocument(dataset.id, location);
          const task = docData.data();

          const projectSelect = document.getElementById('task-project');
          const taskAssigneeSelect = document.getElementById('task-assignee');
          projectSelect.textContent = '';
          taskAssigneeSelect.textContent = '';

          let startDate;
          if (task.startDate == null) {
            startDate = task.dueDate;
          } else {
            startDate = task.startDate;
          }

          let lastEdit;
          if (task.lastEdit == null) {
            lastEdit = task.creationDate;
          } else {
            lastEdit = task.lastEdit;
          }

          //change all fields to read only

          taskForm['task-title'].disabled = true;
          taskForm['task-project'].disabled = true;
          taskForm['task-assignee'].disabled = true;
          taskForm['task-status'].disabled = true;
          taskForm['task-priority'].disabled = true;
          taskForm['task-creationDate'].disabled = true;
          taskForm['task-startDate'].disabled = true;
          taskForm['task-dueDate'].disabled = true;
          taskForm['task-lastEdit'].disabled = true;

          taskForm['task-title'].value = task.title;

          //project dropdown
          taskForm['task-project'].value = '';
          const firstProjectOption = document.createElement('option');
          firstProjectOption.value = '';
          firstProjectOption.textContent = '--Select Project--';
          projectSelect.appendChild(firstProjectOption);
          firstProjectOption.selected = true;
          firstProjectOption.disabled = true;

          const projectSortField = 'creationDate';
          const projectSortBy = 'desc';
          appController.callGetDocumentSnapshot('projects', (querySnapshot) => {
            //get all projects in dropdown and make selected one
            querySnapshot.forEach(projectData => {
              const project = projectData.data()

              const projectOption = document.createElement('option');
              projectOption.value = projectData.id;
              projectOption.textContent = project.projectName;

              if (projectData.id == projectId) {
                //make selected
                firstProjectOption.selected = false;
                projectOption.selected = true;
              }
              projectSelect.appendChild(projectOption)
            })
          }, projectSortField, projectSortBy);

          //assignee
          const firstAssigneeOption = document.createElement('option');
          firstAssigneeOption.value = '';
          firstAssigneeOption.textContent = '--Select Assignee--';
          taskAssigneeSelect.appendChild(firstAssigneeOption);
          firstAssigneeOption.selected = true;
          firstAssigneeOption.disabled = true;

          const taskSortField = 'lastLogin';
          const taskSortBy = 'desc';
          appController.callGetDocumentSnapshot('users', (users) => {
            users.forEach(user => {

              const userData = user.data()
              //for each user create an opttion
              const userOption = document.createElement('option');
              userOption.value = user.id;
              userOption.textContent = userData.firstName + ' ' + userData.lastName;

              //if user is task asignee, make him the selected option
              if (user.id == task.assignee) {
                firstAssigneeOption.selected = false;
                userOption.selected = true;
              }

              taskAssigneeSelect.appendChild(userOption);
            });
          }, taskSortField, taskSortBy);

          taskForm['task-status'].value = task.status;
          taskForm['task-priority'].value = task.priority;
          taskForm['task-creationDate'].valueAsDate = task.creationDate.toDate();
          taskForm['task-startDate'].valueAsDate = startDate.toDate();
          taskForm['task-dueDate'].valueAsDate = task.dueDate.toDate();
          taskForm['task-lastEdit'].valueAsDate = lastEdit.toDate();

          id = docData.id;
        })
      });
    }, sortField, sortBy);

    //Admin & Dev
    if (this.currentUserRole == 0 || this.currentUserRole == 1) { //admins and devs can create and update

      const deleteBtn = document.getElementById('btn-task-delete');
      const editBtn = document.getElementById('btn-task-edit');
      const cancelBtn = document.getElementById('btn-task-cancel');
      const saveBtn = document.getElementById('btn-task-save');
      const createBtn = document.getElementById('btn-create-task-modal');
      editBtn.style.display = 'block';

      //Admin only
      if (this.currentUserRole == 0) { //only admins can delete tasks
        //Delete
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();

          console.log('delete button');
          //appController.callDeleteDocument(dataset.id, location)
        })
      }

      //Create
      createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectSelect = document.getElementById('task-project');
        const taskAssigneeSelect = document.getElementById('task-assignee');
        projectSelect.textContent = '';
        taskAssigneeSelect.textContent = '';

        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        cancelBtn.style.display = 'block';

        taskForm.reset();

        taskForm['task-title'].disabled = false;
        taskForm['task-project'].disabled = false;
        taskForm['task-assignee'].disabled = false;
        taskForm['task-status'].disabled = false;
        taskForm['task-priority'].disabled = false;
        taskForm['task-startDate'].disabled = false;
        taskForm['task-dueDate'].disabled = false;

        //project dropdown
        taskForm['task-project'].value = '';
        const firstProjectOption = document.createElement('option');
        firstProjectOption.value = '';
        firstProjectOption.textContent = '--Select Project--';
        projectSelect.appendChild(firstProjectOption);
        firstProjectOption.selected = true;
        firstProjectOption.disabled = true;

        const projectSortField = 'creationDate';
        const projectSortBy = 'desc';
        appController.callGetDocumentSnapshot('projects', (querySnapshot) => {
          //get all projects in dropdown and make selected one
          querySnapshot.forEach(projectData => {
            const project = projectData.data()

            const projectOption = document.createElement('option');
            projectOption.value = projectData.id;
            projectOption.textContent = project.projectName;

            if (projectData.id == projectId) {
              //make selected
              firstProjectOption.selected = false;
              projectOption.selected = true;
            }
            projectSelect.appendChild(projectOption)
          })
        }, projectSortField, projectSortBy);

        //assignee
        const firstAssigneeOption = document.createElement('option');
        firstAssigneeOption.value = '';
        firstAssigneeOption.textContent = '--Select Assignee--';
        taskAssigneeSelect.appendChild(firstAssigneeOption);
        firstAssigneeOption.selected = true;
        firstAssigneeOption.disabled = true;

        const taskSortField = 'lastLogin';
        const taskSortBy = 'desc';
        appController.callGetDocumentSnapshot('users', (users) => {
          users.forEach(user => {

            const userData = user.data()
            //for each user create an opttion
            const userOption = document.createElement('option');
            userOption.value = user.id;
            userOption.textContent = userData.firstName + ' ' + userData.lastName;

            taskAssigneeSelect.appendChild(userOption);
          });
        }, taskSortField, taskSortBy);

      })

      //Edit
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();

        taskForm['task-title'].disabled = false;
        taskForm['task-project'].disabled = false;
        taskForm['task-assignee'].disabled = false;
        taskForm['task-status'].disabled = false;
        taskForm['task-priority'].disabled = false;
        taskForm['task-startDate'].disabled = false;
        taskForm['task-dueDate'].disabled = false;
        deleteBtn.style.display = 'block';
        editBtn.style.display = 'none';
        cancelBtn.style.display = 'block';
        saveBtn.style.display = 'block';
        toBeEdited = true;
        taskForm['btn-task-save'].textContent = 'Update';
      });

      //Cancel
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const taskModal = document.getElementById('createTaskModal');
        const modal = bootstrap.Modal.getInstance(taskModal);

        taskForm['task-title'].disabled = true;
        taskForm['task-project'].disabled = true;
        taskForm['task-assignee'].disabled = true;
        taskForm['task-status'].disabled = true;
        taskForm['task-priority'].disabled = true;
        taskForm['task-startDate'].disabled = true;
        taskForm['task-dueDate'].disabled = true;
        deleteBtn.style.display = 'none';
        editBtn.style.display = 'block';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        taskForm['btn-task-save'].textContent = 'Save';

        taskForm.reset();
        modal.hide();
      });

      //Submit
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskModal = document.getElementById('createTaskModal');
        const modal = bootstrap.Modal.getInstance(taskModal);

        const taskTitle = taskForm['task-title'].value;
        const taskProject = taskForm['task-project'].value;
        const taskAssignee = taskForm['task-assignee'].value;
        const taskStatus = taskForm['task-status'].value;
        const taskPriority = taskForm['task-priority'].value;
        const taskStartDate = taskForm['task-startDate'].valueAsDate;
        const taskDueDate = taskForm['task-dueDate'].valueAsDate;

        let taskData;
        if (!toBeEdited) { //new task
          taskData = {
            title: taskTitle,
            project: taskProject,
            assignee: taskAssignee,
            status: parseInt(taskStatus),
            priority: parseInt(taskPriority),
            startDate: taskStartDate,
            dueDate: taskDueDate,
            createdBy: appController.appSession.user.uid,
            creationDate: Timestamp.now()
          }
          appController.callSaveDocument(taskData, location);
          console.log('task created!');
        } else { //task edit
          taskData = {
            title: taskTitle,
            project: taskProject,
            assignee: taskAssignee,
            status: parseInt(taskStatus),
            priority: parseInt(taskPriority),
            startDate: taskStartDate,
            dueDate: taskDueDate,
            editedBy: appController.appSession.user.uid,
            lastEdit: Timestamp.now()
          }
          appController.callUpdateDocument(id, taskData, location);
          console.log('task information udpated!');
          toBeEdited = false;
          taskForm['btn-task-save'].textContent = 'Save';
        }

        taskForm['task-title'].disabled = true;
        taskForm['task-project'].disabled = true;
        taskForm['task-assignee'].disabled = true;
        taskForm['task-status'].disabled = true;
        taskForm['task-priority'].disabled = true;
        taskForm['task-startDate'].disabled = true;
        taskForm['task-dueDate'].disabled = true;
        deleteBtn.style.display = 'none';
        editBtn.style.display = 'block';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';

        taskForm.reset();
        modal.hide();
      })
    }


  }

  displayTasks() {
    console.log('tasks');
  }
}
