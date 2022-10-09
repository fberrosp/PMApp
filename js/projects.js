import { saveProject , onGetProjects, deleteProject, getProject, updateProject, getTimestamp } from "./firebase.js";

const projectForm = document.getElementById('project-form');
const projectTableBody = document.getElementById('project-table-body');
const projectRowData = document.createDocumentFragment();

let editStatus = false;
let id = ''

//Get projects real time -> table version
window.addEventListener('DOMContentLoaded', async () => {
    onGetProjects((querySnapshot) => {
        projectTableBody.textContent = '';

        querySnapshot.forEach(doc => {
            const project = doc.data();
            const createDate = project.creationDate.toDate().toString().slice(0, 21)
            let lastDate;
            if (project.lastEdit != null) {
                lastDate = project.lastEdit.toDate().toString().slice(0, 21)
            } else {
                lastDate = "No edits"
            }

            let row = document.createElement('tr');
            let projectName = document.createElement('th');
            let projectOwner = document.createElement('td');
            let creationDate = document.createElement('td');
            let lastEdit = document.createElement('td');
            let editProject = document.createElement('td');
            let editProjectButton = document.createElement('button');
            let deleteProject = document.createElement('td');
            let deleteProjectButton = document.createElement('button');

            projectName.textContent = project.projectName;
            projectOwner.textContent = project.projectOwner;
            creationDate.textContent = createDate;
            lastEdit.textContent = lastDate;
            editProject.appendChild(editProjectButton);
            editProjectButton.setAttribute('data-id', doc.id);
            editProjectButton.setAttribute('data-bs-toggle', 'modal');
            editProjectButton.setAttribute('data-bs-target', '#createProjectModal');
            editProjectButton.classList.add('btn', 'btn-secondary', 'btn-edit');
            editProjectButton.textContent = 'Edit';
            deleteProject.appendChild(deleteProjectButton);
            deleteProjectButton.setAttribute('data-id', doc.id);
            deleteProjectButton.classList.add('btn', 'btn-primary', 'btn-delete');
            deleteProjectButton.textContent = 'Delete';

            row.appendChild(projectName);
            row.appendChild(projectOwner);
            row.appendChild(creationDate);
            row.appendChild(lastEdit);
            row.appendChild(editProject);
            row.appendChild(deleteProject);

            projectRowData.appendChild(row);
            projectTableBody.appendChild(projectRowData);
            
        });

        //delete project
        const btnsDelete = projectTableBody.querySelectorAll(".btn-delete")
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                deleteProject(dataset.id)
            })
        })

        //edit project
        const btnsEdit = projectTableBody.querySelectorAll(".btn-edit")
        .forEach(btn => {
            btn.addEventListener('click', async ({target: {dataset}}) => {
                const doc = await getProject(dataset.id)
                const project = doc.data()

                projectForm['project-title'].value = project.projectName
                projectForm['project-owner'].value = project.projectOwner
                projectForm['project-description'].value = project.description

                editStatus = true;
                id = doc.id;
                projectForm['btn-project-save'].textContent = 'Update'
            })
        })
    });
});

//submit or edit
projectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const projectName = projectForm['project-title']
    const projectOwner = projectForm['project-owner']
    const description = projectForm['project-description']
    
    if (!editStatus) {
        saveProject(projectName.value, projectOwner.value, description.value);
    }else{
        const newFields = {
            projectName: projectName.value,
            projectOwner: projectOwner.value,
            description: description.value,
            lastEdit: getTimestamp()
        }
        updateProject(id, newFields);
        editStatus = false;
        projectForm['btn-project-save'].textContent = 'Save'
    }
    projectForm.reset()
})