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
        <v-row class="hidden-sm-and-down">
            <v-col>
                <v-tabs show-arrows background-color="primary" dark v-model="tab">
                    <v-tab v-for="(team, index) in teams" :key="index">{{team.division}}<span
                            v-if="team.division==='Senioren'" class="mx-1"></span>{{team.divrank}}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item v-for="(team, index) in teams" :key="index">
                        <v-row class="pl-2">
                            <v-col cols="12">
                                <v-btn text x-small link :to="{path: '/team/'+team['.key']}">
                                    <v-icon x-small left>mdi-pencil</v-icon>
                                    Bewerken
                                </v-btn>
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
        <v-container class="d-md-none pa-0">
            <v-row>
                <v-col cols="12" class="col-sm-8">
                    <v-combobox
                            :items="this.teams"
                            item-text="name"
                            label="Selecteer een team..."
                            v-model="selected"
                            hide-details="true"
                    >
                    </v-combobox>
                </v-col>
            </v-row>
            <v-row class="pl-2" v-if="selected">
                <v-col cols="12">
                    <v-btn text x-small link :to="{path: '/team/'+selected['.key']}">
                        <v-icon x-small left>mdi-pencil</v-icon>
                        Bewerken
                    </v-btn>
                </v-col>
                <v-col cols="6" class="flex-shrink-1 flex-grow-0 col-sm-auto flex-sm-shrink-1">
                    <v-subheader light>HEREN</v-subheader>
                    <v-list v-if="selected.players.males.length > 0">
                        <v-list-item v-for="(player, index) in selected.players.males" :key="index">
                            {{player.fullname}}
                        </v-list-item>
                    </v-list>
                    <v-list-item v-else>
                        Geen heren
                    </v-list-item>
                </v-col>
                <v-col>
                    <v-subheader>DAMES</v-subheader>
                    <v-list v-if="selected.players.females.length > 0">
                        <v-list-item v-for="(player, index) in selected.players.females" :key="index">
                            {{player.fullname}}
                        </v-list-item>
                    </v-list>
                    <v-list-item v-else>
                        Geen dames
                    </v-list-item>
                </v-col>
            </v-row>
        </v-container>
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
                selected: undefined,
            };
        },
        firestore() {
            return {
                teamsRef: {
                    ref: db.collection('teams'),
                    resolve: (data) => {
                        this.teams = data;
                        this.sortTeams(this.teams);
                        this.teams.forEach(team => {
                            team.name = team.division + team.divrank
                        })
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
