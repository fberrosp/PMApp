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

    //Projects
    callOnGetProjects(callback) {
        this.appModel.onGetProjects(callback);
    }

    callSaveProject(saveFields) {
        this.appModel.saveProject(saveFields);
    }

    callGetProject(id) {
        this.appModel.getProject(id);
    }

    callDeleteProject(id) {
        this.appModel.deleteProject(id);
    }

    callUpdateProject(id, newFields) {
        this.appModel.updateProject(id, newFields);
    }

    //ProjectTasks
    callGetTasksOfProjects(location, callback) {
        this.appModel.getTasksofProjects(location, callback);
    }

    callDeleteTask(id, location) {
        this.appModel.deleteTask(id, location);
    }

    callGetTask(id, location) {
        this.appModel.getTask(id, location);
    }

    callSaveTask(taskData, location) {
        this.appModel.saveTask(taskData, location)
    }

    callUpdateTask(id, taskData, location) {
        this.appModel.updateTask(id, taskData, location)
    }

}

export const appController = new Controller(new Session(), new View(), new Model());
appController.init()