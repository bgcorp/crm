import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'materialize-css/dist/js/materialize'
import dateFilter from './filters/date.filter'
import currencyFilter from './filters/currency.filter'
import localizeFilter from './filters/localize.filter'

import tooltipDirective from './directives/tooltip.directive'

import messagePlugin from './utils/message.plugin'

import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

import Loader from './components/app/Loader.vue'
import Paginate from './components/app/Paginate.vue'

firebase.initializeApp({
  apiKey: 'AIzaSyCJOMkOZT5cZSZ4F6wLSidHsL5uZgBTUmk',
  authDomain: 'vue-app-crm-fe243.firebaseapp.com',
  projectId: 'vue-app-crm-fe243',
  storageBucket: 'vue-app-crm-fe243.appspot.com',
  messagingSenderId: '281955058909',
  appId: '1:281955058909:web:2cb905047379a34c6c4734',
  measurementId: 'G-1QZZBQ2CYX'
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    app.config.globalProperties.$filters = {
      dateFilter,
      currencyFilter,
      localize: localizeFilter
    }

    app.directive('tooltip', tooltipDirective)

    app.component('Loader', Loader)
    app.component('Paginate', Paginate)

    app.use(messagePlugin).use(store).use(router)

    app.mount('#app')
  }
})
