import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Players from "@/components/Players";
import EditPlayer from "@/components/EditPlayer";
import NewPlayer from "@/components/NewPlayer";
import Teams from "@/components/Teams";
import TeamBuilder from "@/components/TeamBuilder";
import Multiselect from 'vue-multiselect'
import Utils from "../api/Utils";
import NewTeam from "../components/NewTeam";
import EditTeam from "../components/EditTeam";

Vue.component('multiselect', Multiselect);
Vue.use(Router);


export default new Router({
    mode: 'history',
    routes: [
        {
            path: '',
            name: 'Home',
            component: Home,
            meta: {
                title: 'Nikantes TC Tools',
            }
        },
        {
            path: '/',
            redirect: Home
        },
        {
            path: '/players',
            name: 'Players',
            component: Players,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Spelers',
            }
        },
        {
            path: '/teams',
            name: 'Teams',
            component: Teams,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Teams',
            }
        },
        {
            path: '/login',
            name: "Login",
            component: Login,
            props: true,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Login',
            }
        },
        {
            path: '/teambuilder',
            name: 'TeamBuilder',
            component: TeamBuilder,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'TeamBuilder',
            }
        },
        {
            path: '/player/:id',
            name: 'player',
            component: EditPlayer,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Speler bewerken',
            },
            beforeEnter: (to, from, next) => {
                if (Utils.timeSinceLogin() > 30) {
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
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Nieuwe speler',
            },
            beforeEnter: (to, from, next) => {
                if (Utils.timeSinceLogin() > 30) {
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
        },
        {
            path: '/add-team',
            name: 'add-team',
            component: NewTeam,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Nieuw team',
            },
            beforeEnter: (to, from, next) => {
                if (Utils.timeSinceLogin() > 30) {
                    next({
                        name: 'Login',
                        query: {
                            nextUrl: to.fullPath,
                        },
                        params: {
                            msg: "Om een nieuw team aan te maken moet je ingelogd zijn. Vul een geldig wachtwoord in."
                        }
                    })
                } else {
                    next()
                }
            }
        },
        {
            path: '/team/:id',
            name: 'team',
            component: EditTeam,
            meta: {
                title: 'Nikantes TC Tools',
                page: 'Team bewerken',
            },
            beforeEnter: (to, from, next) => {
                if (Utils.timeSinceLogin() > 30) {
                    next({
                        name: 'Login',
                        query: {
                            nextUrl: to.fullPath
                        },
                        params: {
                            msg: "Om een team te bewerken moet je ingelogd zijn. Vul een geldig wachtwoord in."
                        }
                    })
                } else {
                    next()
                }
            }
        },
    ]
})
