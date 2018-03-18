// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import vueEventCalendar from 'vue-event-calendar';
import '../node_modules/vue-event-calendar/dist/style.css';

Vue.config.productionTip = false;
Vue.use(vueEventCalendar, { locale: 'en' });
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
