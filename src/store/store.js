import Vue from 'vue'
import Vuex from 'vuex'
import router from '../routes/routes.js'
import routerAccess from './routerAccess.js' // reference to router
import UserService from '../services/userService.js'
import firebase from 'firebase'

Vue.use(Vuex);
Vue.use(firebase);

// Relevant information to login and logout the user
export const store = new Vuex.Store({
  state:{
    curUser: {} // initially set to the empty
  },
  getters: {
    loggedIn(state){
      return state.curUser !== null;
    },
    getCurrentUser(state){
      return state.curUser;
    }
  },
  mutations: {
    logoutMutation(state){
      firebase.auth().signOut().then(function(){
        let router = routerAccess.getRouter();
        router.push('/login'); // router should push to the login page
        state.curUser = {} // reset curUser
      }).catch(function (err) {
        console.log(err.message);
      });
    },
    loginMutation(state,payload){
      let self = this;
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(function(user){
        state.curUser = firebase.auth().currentUser;
        UserService.setCurrentUser(state.curUser); // set current user for the system in userService
        let router = routerAccess.getRouter(); // get the ref to the router
        router.push('/'); // push to the router to dashboard 
      });
    }
  },
  actions:{
    logout({commit}){
      commit('logoutMutation');
    },
    login({commit},payload){
      commit('loginMutation',payload);
    }
  }
});
