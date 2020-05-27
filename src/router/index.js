import Vue from 'vue'
import Router from 'vue-router'
import Players from "@/components/Players";
import TeamBuilder from "../components/TeamBuilder";
import Multiselect from 'vue-multiselect'
import EditPlayer from "../components/EditPlayer";
import NewPlayer from "../components/NewPlayer";

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
        },
        {
            path: '/player/:id',
            name: 'player',
            component: EditPlayer,
        },
        {
            path: '/add-player',
            name: 'add-player',
            component: NewPlayer,
        }
    ]
})
