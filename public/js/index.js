const customScripts = document.getElementById('custom-scripts');
const scriptsContainer = document.createDocumentFragment();

//Bootstrap
const bootstrapScript = document.createElement('script');
bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js';
bootstrapScript.setAttribute('integrity', 'sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3');
bootstrapScript.setAttribute('crossorigin', 'anonymous');

//Controller
const controllerScript = document.createElement('script');
controllerScript.setAttribute('type', 'module');
controllerScript.src = 'js/controller.js'

scriptsContainer.appendChild(bootstrapScript);
scriptsContainer.appendChild(controllerScript);

customScripts.appendChild(scriptsContainer);