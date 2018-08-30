//import firebase database here
let currentUser = {};

export default {
  setCurrentUser(data){ // sets the current user for the system
    currentUser = data;
  },
  getCurrentUserId(){ // returns the id related to the current company 
    return currentUser.uid;
  }
}
