import { saveTask , onGetTasks, deleteTask, getTask, updateTask, getTimestamp, getTasksOfProject } from "/models/firebase.js";

const taskForm = document.getElementById('task-form');
const taskTableBody = document.getElementById('task-table-body');
const taskRowData = document.createDocumentFragment();

let editStatus = false;
let id = ''

if (taskForm !== null){

    if (document.readyState !== 'loading') {
        console.log('document is already ready, just execute code here');
        displayTasks();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('document was not ready, place code here');
            displayTasks();
        });
    };

    async function displayTasks() {

        let projectCollection = 'projects/';
        let projectId = sessionStorage.getItem('projectId');
        let tasksCollection = '/tasks';
        let location = projectCollection.concat(projectId, tasksCollection);

        getTasksOfProject(location, (querySnapshot) => {
            taskTableBody.textContent = '';
            
            querySnapshot.forEach(doc => {
                const task = doc.data();
                const dueDate = task.dueDate.toDate().toString().slice(0, 21);

                let row = document.createElement('tr');
                let taskName = document.createElement('th');
                let taskStatus = document.createElement('td');
                let taskPriority = document.createElement('td');
                let taskDue = document.createElement('td');
                let editTask = document.createElement('td');
                let editTaskButton = document.createElement('button');
                let deleteTask = document.createElement('td');
                let deleteTaskButton = document.createElement('button');

                taskName.textContent = task.title;
                taskStatus.textContent = task.status;
                taskPriority.textContent = task.priority;
                taskDue.textContent = dueDate;
                editTask.appendChild(editTaskButton);
                editTaskButton.setAttribute('data-id', doc.id);
                editTaskButton.setAttribute('data-bs-toggle', 'modal');
                editTaskButton.setAttribute('data-bs-target', '#createTaskModal');
                editTaskButton.classList.add('btn', 'btn-secondary', 'btn-edit');
                editTaskButton.textContent = 'Edit';
                deleteTask.appendChild(deleteTaskButton);
                deleteTaskButton.setAttribute('data-id', doc.id);
                deleteTaskButton.classList.add('btn', 'btn-primary', 'btn-delete');
                deleteTaskButton.textContent = 'Delete';

                row.appendChild(taskName);
                row.appendChild(taskStatus);
                row.appendChild(taskPriority);
                row.appendChild(taskDue);
                row.appendChild(editTask);
                row.appendChild(deleteTask);

                taskRowData.appendChild(row);
                taskTableBody.appendChild(taskRowData);
                
            });

            //delete task
            const btnsDelete = taskTableBody.querySelectorAll(".btn-delete")
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({target: {dataset}}) => {
                    deleteTask(dataset.id)
                })
            })

            //edit task
            const btnsEdit = taskTableBody.querySelectorAll(".btn-edit")
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({target: {dataset}}) => {
                    const doc = await getTask(dataset.id);
                    const task = doc.data();

                    taskForm['task-title'].value = task.title;
                    taskForm['task-status'].value = task.status;
                    taskForm['task-priority'].value = task.priority;
                    taskForm['task-dueDate'].valueAsDate = task.dueDate;


                    editStatus = true;
                    id = doc.id;
                    taskForm['btn-task-save'].textContent = 'Update';
                })
            })
        });
    }


    //submit or edit
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const title = taskForm['task-title'];
        const status = taskForm['task-status'];
        const priority = taskForm['task-priority'];
        const dueDate = taskForm['task-dueDate'];

        
        if (!editStatus) {
            const taskData = {
                title: title.value,
                status: status.value,
                priority: priority.value,
                dueDate: dueDate.value,
                creationDate: getTimestamp()
            }

            saveTask(taskData);
        }else{
            const taskData = {
                title: title.value,
                status: status.value,
                priority: priority.value,
                dueDate: dueDate.valueAsDate,
                lastEdit: getTimestamp()
            }

            updateTask(id, taskData);
            editStatus = false;
            taskForm['btn-task-save'].textContent = 'Save';
        }
        taskForm.reset()
    })
};
