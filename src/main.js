import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueFirestore from 'vue-firestore';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(VueFirestore);

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');

