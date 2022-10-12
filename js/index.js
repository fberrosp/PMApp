const pageBody = document.getElementById('page-top');
const scriptsContainer = document.createDocumentFragment();

//Head
const headScript = document.createElement('script');
headScript.src = 'js/head.js'

//Body Layout
const sidebarScript = document.createElement('script');
sidebarScript.src = 'js/sidebar.js';
//...

//Bootstrap
const bootstrapScript = document.createElement('script');
bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js';
bootstrapScript.setAttribute('integrity', 'sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8');
bootstrapScript.setAttribute('crossorigin', 'anonymous');

//Body controller scripts (CONTROLLER -> interacts with view and model)
//(add controller script to decide which script will be displayed)
const sessionController = document.createElement('script');
sessionController.src = 'controllers/sessionController.js'

//scriptsContainer.appendChild(headScript);
//scriptsContainer.appendChild(sidebarScript);
scriptsContainer.appendChild(bootstrapScript);
scriptsContainer.appendChild(sessionController);

pageBody.appendChild(scriptsContainer);
