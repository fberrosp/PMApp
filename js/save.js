import { saveTask , getTasks, onGetTasks} from "./firebase.js";


const tasksContainer = document.getElementById('tasks-container')

window.addEventListener('DOMContentLoaded', async () => {
    onGetTasks((querySnapshot) => {
        let html = '';

        querySnapshot.forEach(doc => {
            const task = doc.data();
            html += `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                </div>
            `;    
        });
        tasksContainer.innerHTML = html;
    });


});

const taskForm = document.getElementById('task-form')

taskForm.addEventListener('submit', (e) => {
    e.preventDefault()


    const title = taskForm['task-title']
    const description = taskForm['task-description']
    
    saveTask(title.value, description.value)

    taskForm.reset()

})