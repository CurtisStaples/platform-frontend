//import firebase database here
import {store} from '../store/store.js'
import firebase from '../store/firebase.js'
import UserService from './userService.js'
const db = firebase.database;
const images = db.collection('images');
const storage = firebase.storage;
const storageRef = storage.ref();

export default {
  getImageURL(fileName,image) { // creates an image url for future access to the image
    let companyID = UserService.getCurrentUserId();
    let timestamp = new Date().getTime();
    let path = '/images/imported/' + companyID +'/' + timestamp + fileName; // path in Firebase Storage
    let imageRef = storageRef.child(path)
    return imageRef.put(image).then(snapshot =>{
      return snapshot.ref.getDownloadURL().then(function(downloadURL){
        return downloadURL; // downloadUrl that will be used in the images collection
        })
      })
    },
  addImages(urls,callback){ // add each of the images to the images collection in Firebase
    // in future need to attach JSON labels to images
    let callbackCheck = [];
    for(let i = 0; i < urls.length; i++){
      let image = {};
      image.url = urls[i];
      image.createdAt = new Date().getTime();
      image.companyID = UserService.getCurrentUserId();
      images.add(image).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        callbackCheck.push(docRef);
        if(callbackCheck.length == urls.length){ // all urls upload
          callback();
        }
    }).catch(function(error) {
      console.error("Error adding document: ", error);
      });
    }

  },
  getImportedPhotos(){ // find all images imported by the comapny of the current user 
    let companyID = UserService.getCurrentUserId();
    return images.where("companyID", "==", companyID).get();
  }
}
