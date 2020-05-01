import Vue from 'vue'
import Router from 'vue-router'
import indexComponent from "@/components/indexComponent";
import TeamBuilder from "../components/TeamBuilder";
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect)
Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '',
            name: 'indexComponent',
            component: indexComponent
        },
        {
            path: '/teambuilder',
            name: 'TeamBuilder',
            component: TeamBuilder
        }
    ]
})
