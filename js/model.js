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

  saveDocument(data, location){
    addDoc(collection(appController.appSession.db, location), data);
  }

  getDocument(id, location){
    return getDoc(doc(appController.appSession.db, location, id));
  }

  deleteDocument(id, location){
    deleteDoc(doc(appController.appSession.db, location, id));
  }

  updateDocument(id, data, location){
    updateDoc(doc(appController.appSession.db, location, id), data);
  }

  getDocumentSnapshot(location, callback){
    const currentData = query(collection(appController.appSession.db, location), orderBy('creationDate', 'desc'));
    onSnapshot(currentData, callback)
  }

}