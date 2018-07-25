import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
// Initialize Firebase
let config = {
  apiKey: "AIzaSyCEjVwhBW16pp7GG5PvLingX050L8p_ZPU",
  authDomain: "buzz-platform.firebaseapp.com",
  databaseURL: "https://buzz-platform.firebaseio.com",
  projectId: "buzz-platform",
  storageBucket: "buzz-platform.appspot.com",
  messagingSenderId: "650069930881"
}
firebase.initializeApp(config)
// Use this line if all of your Date types are in timestamps formats
// firebase.firestore().settings({timestampsInSnapshots: true})

export default {
  database: firebase.firestore(),
  settings: firebase.firestore().settings({ timestampsInSnapshots: true }),
  storage : firebase.storage(),
  auth: firebase.auth()
}
