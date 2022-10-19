import { Model } from "./model.js";
import { View } from "./view.js";
import { Session } from "./session.js";

class Controller {
    constructor(appSession, appView, appModel) {
        //authentication (is the user authenicated?, true/false) --> class session 
        //load index view if true
        //load register/login view if false
        //load view
        this.appSession = appSession;
        this.appView = appView;
        this.appModel = appModel;
    }
    init() {
        this.appSession.init();
    }

    //Authentication
    callRegisterUser(newUserData) {
        this.appSession.registerUser(newUserData);
    }

    callUserLogin(existingUserData) {
        this.appSession.userLogin(existingUserData);
    }

    callSaveUserData(user, firstName, lastName) {
        this.appModel.saveUserData(user, firstName, lastName);
    }

    callGoogleLogin() {
        this.appSession.googleLogin();
    }

    callUserLogout() {
        this.appSession.logoutSession();
    }

    //Session Start
    userAuthenticated() {
        this.appView.indexView();
    }

    userNotAuthenticated() {
        this.appView.init();
    }

    //CRUD operations
    callSaveDocument(data, location){
        this.appModel.saveDocument(data, location);
    }

    callGetDocument(id, location){
        this.appModel.getDocument(id, location);
    }

    callDeleteDocument(id, location){
        this.appModel.deleteDocument(id, location);
    }

    callUpdateDocument(id, data, location){
        this.appModel.updateDocument(id, data, location);
    }

    callGetDocumentSnapshot(location, callback){
        this.appModel.getDocumentSnapshot(location, callback);
    }

    //Navigation
    callDisplayRoleAssignments(){
        this.appView.displayRoleAssignments();
    }

    callDisplayProjectTeams(){
        this.appView.displayProjectTeams();
    }

    callDisplayProjects(){
        this.appView.displayProjects();
    }

    callDisplayEpics(){
        this.appView.displayEpics();
    }

    callDisplayTasks(){
        this.appView.displayTasks();
    }

}

export const appController = new Controller(new Session(), new View(), new Model());
appController.init()