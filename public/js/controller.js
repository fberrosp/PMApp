import { Model } from "./model.js";
import { View } from "./view.js";
import { Session } from "./session.js";

class Controller {
    constructor(appSession, appView, appModel) {
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
    callSaveDocument(data, location) {
        this.appModel.saveDocument(data, location);
    }

    callGetDocument(id, location) {
        return this.appModel.getDocument(id, location);
    }

    callGetDocuments(location) {
        return this.appModel.getDocuments(location);
    }

    callGetCollectionGroup(location) {
        return this.appModel.getCollectionGroup(location);
    }

    callDeleteDocument(id, location) {
        this.appModel.deleteDocument(id, location);
    }

    callUpdateDocument(id, data, location) {
        this.appModel.updateDocument(id, data, location);
    }

    callGetDocumentSnapshot(location, callback, sortField, sortBy) {
        this.appModel.getDocumentSnapshot(location, callback, sortField, sortBy);
    }

}

export const appController = new Controller(new Session(), new View(), new Model());
appController.init()