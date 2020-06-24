<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <v-container>
        <v-row>
            <v-col>
                <v-btn color="primary"
                       outlined link :to="{name: 'add-team'}">
                    <v-icon left>mdi-plus</v-icon>
                    Nieuw team
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-tabs show-arrows background-color="primary" dark v-model="tab">
                    <v-tab v-for="(team, index) in teams" :key="index">{{team.division}}<span v-if="team.division==='Senioren'" class="mx-1"></span>{{team.divrank}}</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item v-for="(team, index) in teams" :key="index">
                        <v-row class="pl-2">
                            <v-col cols="12">
                                <v-btn text x-small link :to="{path: '/team/'+team['.key']}">
                                    <v-icon x-small left>mdi-pencil</v-icon>Bewerken</v-btn>
                            </v-col>
                            <v-col cols="4" class="flex-shrink-1 flex-grow-0">
                                <v-subheader light>HEREN</v-subheader>
                                <v-list v-if="team.players.males.length > 0">
                                    <v-list-item v-for="(player, index) in team.players.males" :key="index">
                                        {{player.fullname}}
                                    </v-list-item>
                                </v-list>
                                <v-list-item v-else>
                                    Geen heren
                                </v-list-item>
                            </v-col>
                            <v-col>
                                <v-subheader>DAMES</v-subheader>
                                <v-list v-if="team.players.females.length > 0">
                                    <v-list-item v-for="(player, index) in team.players.females" :key="index">
                                        {{player.fullname}}
                                    </v-list-item>
                                </v-list>
                                <v-list-item v-else>
                                    Geen dames
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import {db} from "./../firebase";

    export default {
        name: "Teams",
        data() {
            return {
                teams: [],
                tab: null,
            };
        },
        firestore() {
            return {
                teamsRef: {
                    ref: db.collection('teams'),
                    resolve: (data) => {
                        this.teams = data;
                        this.sortTeams(this.teams)
                    }
                }
            }
        },
        mounted() {

        },
        methods: {
            sortTeams(teams) {
                teams.sort((a, b) => {
                    return b.divisionIndex - a.divisionIndex;
                })
            }
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
