import Vue from 'vue'
import Router from 'vue-router'
import Players from "@/components/Players";
import TeamBuilder from "../components/TeamBuilder";
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect);
Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '',
            name: 'Players',
            component: Players
        },
        {
            path: '/',
            redirect: Players
        },
        {
            path: '/teambuilder',
            name: 'TeamBuilder',
            component: TeamBuilder
        }
    ]
})
