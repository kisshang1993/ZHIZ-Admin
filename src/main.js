// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
//iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
//Editor

//Custom
import './assets/css/main.css';
import GetUserDetail from './components/Userdetail/index';

Vue.config.productionTip = false
Vue.use(iView);
Vue.use(Vuex)

//资源
const store = new Vuex.Store({
  state: {
    baseURL: '',
    token: '',
    article_page: 1,
    article_page_size: 15
  },
  mutations: {
    set_host(state, host) {
      state.baseURL = host
    },
    set_token(state, token) {
      state.token = token
      localStorage.token = token
    },
    del_token(state) {
      state.token = ''
      localStorage.removeItem('token')
    }
  }
})
//axios 全局设置
axios.interceptors.request.use((config) => {
  let token = store.state.token;
  if (token) {
    config.headers.token = token;
  }
  return config;
}, (err) => {
  return Promise.reject(err);
});

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 403:
      case 404:
        store.commit('del_token')
        router.push('/login?state=expired')
    }
  }
  return Promise.reject(error)
})

Vue.use(VueAxios, axios);
Vue.use(GetUserDetail)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
