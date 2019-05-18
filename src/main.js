// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import firebase from 'firebase';
import 'firebase/firestore'
import {VueFire} from 'vuefire'
import {FirebaseConfig} from './environments/firebase.config'
import Home from './components/home.vue'
import AddWord from './components/add-word.vue'
import Admin from './components/admin.vue'
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import auth from './auth'
import Firestore from 'vue-firestore'


Vue.use(Firestore)

Vue.config.productionTip = false

const firebaseApp = firebase.initializeApp(FirebaseConfig.config, {
  timestampsInSnapshots: true
})
var db;
export default db = firebaseApp.firestore()


// old versiayi errori hamar
const settings = { timestampsInSnapshots: true };
firebaseApp.firestore().app.firestore().settings(settings);
//-------------------

window.firebase = firebase;


// Vue.use(VueFire)
Vue.use(VueRouter)
Vue.config.productionTip = false
const routes = [
  { path:'/', component:Home},
  { path:'/admin', component:Admin},
  { path:'/add-word', component:AddWord, beforeEnter:requireAuth},
];
const router = new VueRouter({
  routes,
  mode:'history'
})
function requireAuth (to, from, next) {
  var interDel = setInterval(function(){
    if(auth.isLogined != undefined){
      clearInterval(interDel)
      if (!auth.isLogined) {
        next({
          path: '/admin',
          query: { redirect: to.fullPath }
        })
      }
       else if (auth.isLogined) {
        next()
      }
    }
    
  }, 100)
  
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
