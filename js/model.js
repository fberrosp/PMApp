import { collection, addDoc, onSnapshot, deleteDoc, doc, getDoc, updateDoc, Timestamp, orderBy, query, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { appController } from "./controller.js"

export class Model {
  saveUserData(user, firstName, lastName) {
    const userData = {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      lastLogin: Timestamp.now()
    };
    setDoc(doc(appController.appSession.db, 'users', user.uid), userData)
      .then(() => {
        console.log('account data saved!')
      })
  }

  onGetProjects(callback) {
    const currentData = query(collection(appController.appSession.db, 'projects'), orderBy('creationDate', 'desc'))
    //console.log(currentData)
    onSnapshot(currentData, callback);
  }

  saveProject(saveFields) {
    addDoc(collection(appController.appSession.db, 'projects'), saveFields)
  }

  async getProject(id) {
    await getDoc(doc(appController.appSession.db, 'projects', id));
  }

  deleteProject(id) {
    deleteDoc(doc(appController.appSession.db, 'projects', id));
  }

  updateProject(id, newFields) {
    updateDoc(doc(appController.appSession.db, 'projects', id), newFields);
  }

  getTasksofProjects(location, callback) {
    const currentData = query(collection(appController.appSession.db, location), orderBy('creationDate', 'desc'))
    //console.log(currentData)
    onSnapshot(currentData, callback);
  };

  deleteTask(id) {
    deleteDoc(doc(appController.appSession.db, location, id));
  }

  async getTask(id, location) {
    await getDoc(doc(appController.appSession.db, location, id));
  }

  saveTask(taskData, location) {
    addDoc(collection(appController.appSession.db, location), taskData);
  }

  updateTask(id, taskData, location) {
    updateDoc(doc(appController.appSession.db, location, id), taskData);
  }
}