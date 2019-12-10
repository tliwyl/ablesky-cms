//import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import apiConfig from '../config/api.config.js'
import routes from './routes'
axios.defaults.baseURL=apiConfig.baseURL

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  mode:'history',
  routes
})
router.beforeEach((to, from, next) => {

  if (to.path === '/login') {
    sessionStorage.removeItem('username');
  }
  if(to.path === '/register'){
    next()
    return;
  }else{
    next()
  }
  if (to.name==='/login') {
    next()
    return;
  } else{
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

