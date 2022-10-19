const customScripts = document.getElementById('custom-scripts');
const scriptsContainer = document.createDocumentFragment();

//Bootstrap
const bootstrapScript = document.createElement('script');
bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js';
bootstrapScript.setAttribute('integrity', 'sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8');
bootstrapScript.setAttribute('crossorigin', 'anonymous');

//Controller
const controllerScript = document.createElement('script');
controllerScript.setAttribute('type', 'module');
controllerScript.src = 'js/controller.js'

scriptsContainer.appendChild(bootstrapScript);
scriptsContainer.appendChild(controllerScript);

customScripts.appendChild(scriptsContainer);