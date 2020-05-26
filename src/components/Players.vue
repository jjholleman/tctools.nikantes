<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card class="player-list-container">
                        <v-card-title>
                            SPELERS
                            <v-spacer></v-spacer>
                            <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Zoeken naar speler..."
                                    single-line
                                    hide-details
                            ></v-text-field>
                        </v-card-title>
                        <v-row>
                            <v-col class="checkdate-controls" cols="12">
                                <div>Peildatum seizoen:</div>
                                <v-btn-toggle v-model="toggle_checkdate_btn" mandatory>
                                    <v-btn @click="toggleCheckDate(0)"
                                           class="checkDate-btn">
                                        {{checkDate.format("YY")-1}}-{{checkDate.format("YY")}}
                                    </v-btn>
                                    <v-btn @click="toggleCheckDate(1)"
                                           class="checkDate-btn">
                                        {{nextCheckDate.format("YY")-1}}-{{nextCheckDate.format("YY")}}
                                    </v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="12">
                                Sorteer op:
                                <v-btn @click="sortMembersTable('firstname')" x-small outlined>Naam</v-btn>
                                <v-btn @click="sortMembersTable('knkv_age')" x-small outlined>Leeftijd (KNKV)</v-btn>
                            </v-col>
                        </v-row>
                        <v-expansion-panels>
                            <v-expansion-panel
                                    :key="index"
                                    class="player"
                                    v-for="(player, index) in sortedList"
                                    v-if="player.knkv_age <= 19"
                            >
                                <v-expansion-panel-header>{{player.fullname}} ({{player.knkv_age}})</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-list>
                                        <v-list-item>Geboortedatum: {{player.date_of_birth.toDate() | moment}}</v-list-item>
                                        <v-list-item>Leeftijd: {{player.age}}</v-list-item>
                                        <v-list-item>Leeftijd op peildatum: {{player.knkv_age}}</v-list-item>
                                        <v-list-item>Laagst mogelijke team: {{player.limit_team}}</v-list-item>
                                    </v-list>
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
                toggle_checkdate_btn: 0,
                players: [],
                divisions: [],
                currentSort: "knkv_age",
                currentSortDir: "desc",
                checkDate: PlayerAPI.getCheckDate(),
                nextCheckDate: PlayerAPI.getCheckDate(true),
            };
        },
        mounted() {
            this.divisions = DivisionAPI.getAllDivisions();
            this.players = PlayerAPI.get();
        },
        methods: {
            toggleCheckDate(next) {
                let checkDate = this.checkDate;
                if (next === 1) {
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
            }
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

</style>
