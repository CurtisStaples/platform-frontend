//import firebase database here
let currentUser = {};

export default {
  setCurrentUser(data){
    currentUser = data;
  },
  getCurrentUserId(){
    return currentUser.uid;
  }
}
