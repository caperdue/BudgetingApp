import Vue from 'vue'
import App from './App.vue'
import firebase from "firebase/app"
import "firebase/firestore"
import VueApexCharts from "vue-apexcharts"
import { AppRouter } from "./app-routing";
import "@firebase/auth";

Vue.use(VueApexCharts)
Vue.config.productionTip = false


const firebaseConfig = {
  apiKey: "AIzaSyAHC4SmoueG_d0kjuiMm-qM4MyvBxHgKhs",
  authDomain: "budgeting-app-ab5c8.firebaseapp.com",
  projectId: "budgeting-app-ab5c8",
  storageBucket: "budgeting-app-ab5c8.appspot.com",
  messagingSenderId: "140566765424",
  appId: "1:140566765424:web:c14322eaee906ae39039b5",
  measurementId: "G-QNYYJR15DZ"
}
firebase.initializeApp(firebaseConfig);
Vue.prototype.$appDB = firebase.firestore();
Vue.prototype.$appAuth = firebase.auth()

new Vue({ 
  router: AppRouter, 
  render: (h) => h(App)
}).$mount('#app')
