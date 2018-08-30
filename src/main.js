import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { store } from './store/store.js'
import firebaseInfo from './store/firebase.js'
import routerAccess from './store/routerAccess.js'
import firebase from 'firebase'
import VModal from 'vue-js-modal'



// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'
// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(VModal)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

routerAccess.setRouter(router);

router.beforeEach((to, from, next) => {

  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (!currentUser && requiresAuth ) {
    next('/login')
  }
  else next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  firebaseInfo,
  firebase,
  router
})
