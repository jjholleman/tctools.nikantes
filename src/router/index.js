import Vue from 'vue'
import Router from 'vue-router'
import indexComponent from "@/components/indexComponent";

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '',
            name: 'indexComponent',
            component: indexComponent
        },
    ]
})
