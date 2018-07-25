import Vue from 'vue'
import Vuex from 'vuex'
import router from '../routes/routes.js'
import routerAccess from './routerAccess.js'
import firebase from 'firebase'

Vue.use(Vuex);
Vue.use(firebase);

export const store = new Vuex.Store({
  state:{
    curUser: {}
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
        router.push('/login');
        sate.curUser = {}
      }).catch(function (err) {
        console.log(err.message);
      });
    },
    loginMutation(state,payload){
      let self = this;
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(function(user){
        state.curUser = firebase.auth().currentUser;
        let router = routerAccess.getRouter();
        router.push('/');
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
