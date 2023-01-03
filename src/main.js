import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import dataV from '@jiaminghi/data-view';
Vue.use(dataV);

// 按需引入vue-awesome图标
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/chart-bar.js';
import 'vue-awesome/icons/chart-area.js';
import 'vue-awesome/icons/chart-pie.js';
import 'vue-awesome/icons/chart-line.js';
import 'vue-awesome/icons/align-left.js';
// 全局注册图标
Vue.component('icon', Icon);

// 适配flex
import '@/utils/flexible.js';

import global from './utils/global' // 全局方法
Vue.use(global)

// 引入全局css
import './assets/scss/style.scss';

Vue.use(ElementUI);

//引入echart
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import 'echarts/map/js/china.js'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
