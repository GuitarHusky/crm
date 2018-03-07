 // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import iView from 'iview'
import store from './vuex/status'
import 'iview/dist/styles/iview.css'    // 使用 CSS
import echarts from 'echarts'
import 'babel-polyfill'

Vue.prototype.$echarts = echarts

Vue.use(iView)
Vue.use(Vuex)

Vue.config.productionTip = false
router.beforeEach((to,from,next)=>{
   console.log(to);
   console.log(from);
   console.log(next);
   next();
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


