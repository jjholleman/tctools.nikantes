<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <v-container>
        <v-row>
            <v-col class="flex-grow-0" cols="12" sm="auto" order-sm="2">
                <v-btn color="primary"
                       class="mt-sm-1 pa-2"
                       outlined link :to="{name: 'add-player'}">
                    <v-icon left>mdi-account-plus</v-icon>
                    Nieuwe speler
                </v-btn>
            </v-col>
            <v-col>
                <v-switch v-model="showSeniors"
                          hide-details
                          class="d-inline-flex mt-1 mt-sm-1 pa-2"
                          label="Senioren"/>
                <v-switch v-model="toggle_checkdate_btn"
                          hide-details
                          class="d-inline-flex mt-1 mt-sm-1 pa-2"
                          @change="toggleCheckDate(toggle_checkdate_btn)"
                          :label="checkDateLabel"/>
            </v-col>
        </v-row>
        <v-row no-gutters class="flex-row">
            <v-col cols="12" sm="8" order-sm="2" class="flex-grow-1">
                <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Zoeken naar speler..."
                        single-line
                        hide-details
                ></v-text-field>
            </v-col>
            <v-col class="sort-controls mt-4 flex-shrink-1" align-self="center">
                <v-btn @click="sortMembersTable('firstname')" x-small text>
                    Naam
                    <v-icon v-if="currentSort==='firstname' && currentSortDir==='asc'" small>mdi-arrow-up</v-icon>
                    <v-icon v-if="currentSort==='firstname' && currentSortDir==='desc'" small>mdi-arrow-down</v-icon>
                </v-btn>
                <v-btn @click="sortMembersTable('knkv_age')" x-small text>
                    Leeftijd (KNKV)
                    <v-icon v-if="currentSort==='knkv_age' && currentSortDir==='asc'" small>mdi-arrow-up</v-icon>
                    <v-icon v-if="currentSort==='knkv_age' && currentSortDir==='desc'" small>mdi-arrow-down</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card outlined flat>
                    <v-expansion-panels tile accordion>
                        <v-expansion-panel
                                :key="index"
                                class="player"
                                v-for="(player, index) in sortedList"
                                v-if="showSeniors || player.knkv_age <= 19"
                        >
                            <v-expansion-panel-header>{{player.fullname}} ({{player.knkv_age}})
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-list>
                                    <v-list-item>Geboortedatum: {{player.date_of_birth.toDate() | moment}}</v-list-item>
                                    <v-list-item>Leeftijd: {{player.age}}</v-list-item>
                                    <v-list-item>Leeftijd op peildatum: {{player.knkv_age}}</v-list-item>
                                    <v-list-item>Laagst mogelijke team: {{player.limit_team}}</v-list-item>
                                </v-list>
                                <v-row class="text-center">
                                    <v-col>
                                        <v-btn link :to="{name: 'EditPlayer', params: {id: player.id}}">
                                            <v-icon left>mdi-pencil</v-icon>
                                            BEWERKEN
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */
    import PlayerAPI from '@/api/Player'
    import DivisionAPI from '@/api/Division'
    import moment from 'moment'

    export default {
        name: "Players",
        props: {
            msg: String
        },
        data() {
            return {
                search: "",
                toggle_checkdate_btn: false,
                players: [],
                divisions: [],
                currentSort: "knkv_age",
                currentSortDir: "desc",
                checkDate: PlayerAPI.getCheckDate(),
                nextCheckDate: PlayerAPI.getCheckDate(true),
                showSeniors: false,
                checkDateLabel: "Peildatum " + PlayerAPI.getCheckDate(true).format("YY") + "-" + PlayerAPI.getCheckDate(true).add(1, "year").format("YY"),
            };
        },
        mounted() {
            this.divisions = DivisionAPI.getAllDivisions();
            this.players = PlayerAPI.getAll();
        },
        methods: {
            toggleCheckDate(next) {
                let checkDate = this.checkDate;
                if (next === true) {
                    checkDate = this.nextCheckDate;
                }
                this.players.forEach(player => {
                    return PlayerAPI.getPlayerKNKVAge(player, checkDate);
                });
            },
            sortMembersTable(s) {
                //if s == current sortMembersTable, reverse
                if (s === this.currentSort) {
                    this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
                }
                this.currentSort = s;
            },
            filterMembersList() {
                return this.players.filter(person => {
                    return person.fullname.toLowerCase().includes(this.search.toLowerCase());
                });
            },
        },
        computed: {
            sortedList() {
                let players = this.filterMembersList();
                return players.sort((a, b) => {
                    let modifier = 1;
                    if (this.currentSortDir === "desc") modifier = -1;
                    if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                    if (a[this.currentSort] > b[this.currentSort]) return modifier;
                    return 0;
                });
            },
        },
        filters: {
            moment: function (date) {
                return moment(date).format("DD-MM-YYYY")
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .v-data-table__expanded__content{
        box-shadow: none;
    }
    .expansion-td {
        background: white;
        padding: 0 10px 10px;
    }
    .player-expand-list {
        box-shadow: none;
        background: transparent;
    }
</style>
