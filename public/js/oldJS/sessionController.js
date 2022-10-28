const pageSessionBody = document.getElementById('page-top');
const scriptsSessionContainer = document.createDocumentFragment();

//Projects script
const projectsScript = document.createElement('script');
projectsScript.type = 'module';
projectsScript.src = 'views/projects.js';

//(epics script)
const tasksScript = document.createElement('script');
tasksScript.type = 'module';
tasksScript.src = 'views/tasks.js';

//Firebase (MODEL -> Database)
const authScript = document.createElement('script');
authScript.type = 'module';
authScript.src = 'models/auth.js';

const firebaseScript = document.createElement('script');
firebaseScript.type = 'module';
firebaseScript.src = 'models/firebase.js';

//scriptsSessionContainer.appendChild(projectsScript);
scriptsSessionContainer.appendChild(tasksScript);
//scriptsSessionContainer.appendChild(authScript);
scriptsSessionContainer.appendChild(firebaseScript);

pageSessionBody.appendChild(scriptsSessionContainer);

