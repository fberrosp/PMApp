import { saveProject , onGetProjects, deleteProject, getProject, updateProject, getTimestamp } from "./firebase.js";

const projectsContainer = document.getElementById('project-container');
const projectForm = document.getElementById('project-form');

let editStatus = false;
let id = ''

//Get projects real time
window.addEventListener('DOMContentLoaded', async () => {
    onGetProjects((querySnapshot) => {
        projectsContainer.innerHTML = '';
        
        querySnapshot.forEach(doc => {
            const project = doc.data();
            const createDate = project.creationDate.toDate().toString().slice(0, 21)
            let lastDate;

            if (project.lastEdit != null) {
                lastDate = project.lastEdit.toDate().toString().slice(0, 21)
            } else {
                lastDate = "No edits"
                //console.log(lastDate)
            }
            projectsContainer.innerHTML += `
                <div class="card card-body mt-2 border-primary">
                    <h3 class="h5">Project: ${project.projectName}</h3>
                    <p>Owner: ${project.projectOwner}</p>
                    <p>Description: ${project.description}</p>
                    <p>Created: ${createDate}</p>
                    <p>Last edited: ${lastDate}</p>
                    <div class="d-flex">
                        <button class = "btn btn-primary btn-delete" data-id="${doc.id}">Delete</button>
                        <button class = "btn btn-secondary btn-edit" data-id="${doc.id}">Edit</button>
                    </div>
                </div>
            `;
            
        });

        //delete project
        const btnsDelete = projectsContainer.querySelectorAll(".btn-delete")
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                deleteProject(dataset.id)
            })
        })

        //edit project
        const btnsEdit = projectsContainer.querySelectorAll(".btn-edit")
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async ({target: {dataset}}) => {
                const doc = await getProject(dataset.id)
                const project = doc.data()

                projectForm['project-title'].value = project.projectName
                projectForm['project-owner'].value = project.projectOwner
                projectForm['project-description'].value = project.description

                editStatus = true;
                id = doc.id;
                projectForm['btn-project-save'].innerText = 'Update'
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
        projectForm['btn-project-save'].innerText = 'Save'
    }
    projectForm.reset()
})