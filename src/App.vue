<template>
    <v-app id="inspire">
        <v-navigation-drawer app v-model="drawer">
            <v-list dense>
                <v-list-item link :to="{path: '/'}">
                    <v-list-item-action>
                        <v-icon>mdi-account-details</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Spelers</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link :to="{path: '/teambuilder'}">
                    <v-list-item-action>
                        <v-icon>mdi-account-group</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>TeamBuilder</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <router-view></router-view>
        </v-content>
        <v-footer app color="indigo">
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
