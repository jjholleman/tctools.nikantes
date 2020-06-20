import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import VueFirestore from 'vue-firestore';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(VueFirestore);

router.beforeEach((to,from,next) => {
  document.title = to.meta.title;
  if(to.meta.page) {
    document.title = to.meta.page +' - '+ document.title
  }
  next();
});

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');

