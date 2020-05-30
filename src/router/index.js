import Vue from 'vue'
import Router from 'vue-router'
import moment from 'moment'
import Players from "@/components/Players";
import TeamBuilder from "../components/TeamBuilder";
import Multiselect from 'vue-multiselect'
import EditPlayer from "../components/EditPlayer";
import NewPlayer from "../components/NewPlayer";
import Login from "../components/Login";

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
            path: '/login',
            name: "Login",
            component: Login,
            props: true,
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
            beforeEnter: (to, from, next) => {
                const lastLogin = moment(new Date(localStorage.getItem("lastLogin")));
                const now = moment();
                const diff = now.diff(lastLogin, 'days');
                if (diff > 30) {
                    next({
                        name: 'Login',
                        query: {
                            nextUrl: to.fullPath
                        },
                        params: {
                            msg: "Om een speler te bewerken moet je ingelogd zijn. Vul een geldig wachtwoord in."
                        }
                    })
                } else {
                    next()
                }
            }
        },
        {
            path: '/add-player',
            name: 'add-player',
            component: NewPlayer,
            beforeEnter: (to, from, next) => {
                const lastLogin = moment(new Date(localStorage.getItem("lastLogin")));
                const now = moment();
                const diff = now.diff(lastLogin, 'days');
                if (diff > 30) {
                    next({
                        name: 'Login',
                        query: {
                            nextUrl: to.fullPath,
                        },
                        params: {
                            msg: "Om een nieuwe speler aan te maken moet je ingelogd zijn. Vul een geldig wachtwoord in."
                        }
                    })
                } else {
                    next()
                }
            }
        }
    ]
})
