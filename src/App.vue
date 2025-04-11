<template>
    <v-app id="inspire">
        <v-navigation-drawer app v-model="drawer">
            <v-list dense>
                <v-list-item link :to="{name: 'Home'}" exact>
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link :to="{name: 'Players'}">
                    <v-list-item-action>
                        <v-icon>mdi-account-details</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Spelers</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link :to="{name: 'Teams'}">
                    <v-list-item-action>
                        <v-icon>mdi-account-group</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Teams</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link disabled :to="{name: 'TeamBuilder'}">
                    <v-list-item-action>
                        <v-icon>mdi-account-hard-hat</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>TeamBuilder</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{$route.meta.page || "TC Tools"}}</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>
        <v-footer app absolute color="indigo">
            <span class="white--text">&copy; 2020-{{moment().year()}} Jordi Holleman</span>
        </v-footer>
    </v-app>
</template>

<script>
    /* eslint-disable no-console */

    import moment from 'moment';

    export default {
        name: 'app',
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
        }),
        methods: {
            moment: function () {
                return moment();
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
