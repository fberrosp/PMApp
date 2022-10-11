import { saveProject , onGetProjects, deleteProject, getProject, updateProject, getTimestamp } from "./firebase.js";

const projectForm = document.getElementById('project-form');
const projectTableBody = document.getElementById('project-table-body');
const projectRowData = document.createDocumentFragment();

let editStatus = false;
let id = '';

//Get projects real time -> table version
window.addEventListener('DOMContentLoaded', async () => {
    onGetProjects((querySnapshot) => {
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

        //task project
        const btnsProjectTask = projectTableBody.querySelectorAll(".btn-projectTask");
        btnsProjectTask.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                const projectId = dataset.id;
                sessionStorage.setItem('projectId', projectId);
                window.location.href = 'blank.html';
            })
        });


        //delete project
        const btnsDelete = projectTableBody.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                deleteProject(dataset.id)
            });
        });

        //edit project
        const btnsEdit = projectTableBody.querySelectorAll(".btn-edit");
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async ({target: {dataset}}) => {
                const doc = await getProject(dataset.id);
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
});

//submit or edit
projectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const projectName = projectForm['project-title'];
    const projectOwner = projectForm['project-owner'];
    const description = projectForm['project-description'];
    
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
        projectForm['btn-project-save'].textContent = 'Save';
    }
    projectForm.reset();
});