import { collection, addDoc, onSnapshot, deleteDoc, doc, getDoc, getDocs, updateDoc, Timestamp, orderBy, query, collectionGroup, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { appController } from "./controller.js"

export class Model {
  saveUserData(user, firstName, lastName) {
    const userData = {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      lastLogin: Timestamp.now(),
      role: 2 //Default role is Viewer
    };
    return setDoc(doc(appController.appSession.db, 'users', user.uid), userData);
  }

  saveDocument(data, location){
    addDoc(collection(appController.appSession.db, location), data);
  }

  getDocument(id, location){
    return getDoc(doc(appController.appSession.db, location, id));
  }

  getDocuments(location){
    return getDocs(collection(appController.appSession.db, location))
  }

  getCollectionGroup(location){
    const queryData = query(collectionGroup(appController.appSession.db, location))
    return getDocs(queryData)
  }

  deleteDocument(id, location){
    deleteDoc(doc(appController.appSession.db, location, id));
  }

  updateDocument(id, data, location){
    updateDoc(doc(appController.appSession.db, location, id), data);
  }

  getDocumentSnapshot(location, callback, sortField, sortBy){
    const currentData = query(collection(appController.appSession.db, location), orderBy(sortField, sortBy));
    onSnapshot(currentData, callback);
  }

}