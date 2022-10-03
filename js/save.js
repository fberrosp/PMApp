import { saveTask , getTasks, onGetTasks, deleteTask, getTask, updateTask } from "./firebase.js";

const tasksContainer = document.getElementById('tasks-container');
const taskForm = document.getElementById('task-form');

let editStatus = false;
let id = ''

window.addEventListener('DOMContentLoaded', async () => {
    onGetTasks((querySnapshot) => {
        let html = '';

        querySnapshot.forEach(doc => {
            const task = doc.data();
            html += `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <button class = "btn-delete" data-id="${doc.id}">Delete</button>
                    <button class = "btn-edit" data-id="${doc.id}">Edit</button>
                </div>
            `;    
        });
        tasksContainer.innerHTML = html;

        //delete task
        const btnsDelete = tasksContainer.querySelectorAll(".btn-delete")
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                deleteTask(dataset.id)
            })
        })

        //edit task
        const btnsEdit = tasksContainer.querySelectorAll(".btn-edit")
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async ({target: {dataset}}) => {
                const doc = await getTask(dataset.id)
                const task = doc.data()

                taskForm['task-title'].value = task.title
                taskForm['task-description'].value = task.description

                editStatus = true;
                id = doc.id;

                taskForm['btn-task-save'].innerText = 'Update'
            })
        })

    });


});


taskForm.addEventListener('submit', (e) => {
    e.preventDefault()


    const title = taskForm['task-title']
    const description = taskForm['task-description']
    
    if (!editStatus) {
        saveTask(title.value, description.value);
    }else{
        updateTask(id, {
            title: title.value, 
            description: description.value});
        editStatus = false;
    }

    taskForm.reset()

})