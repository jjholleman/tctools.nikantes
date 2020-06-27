<template>
    <v-container v-if="this.team">
        <v-row no-gutters class="mb-8">
            <v-col>
                <v-btn x-small text link @click="$router.back()" color="primary">
                    <v-icon left>mdi-arrow-left</v-icon>
                    terug
                </v-btn>
            </v-col>
            <v-switch v-model="toggle_checkdate_btn"
                      hide-details
                      inset
                      dense
                      class="d-inline-flex mt-1 mt-sm-1 pa-2"
                      @change="toggleCheckDate(toggle_checkdate_btn)"
                      :label="checkDateLabel"/>
        </v-row>
        <v-form ref="form" v-model="valid" :lazy-validation="true">
            <v-select
                    label="Teamletter"
                    v-model="team.division"
                    :rules="[rules.required]"
                    required
                    :items="divisions"
                    item-text="name"
            ></v-select>
            <v-text-field type="number"
                          min="1"
                          label="Teamnummer"
                          v-model="team.divrank"
                          :rules="[rules.required]"
                          required></v-text-field>
            <v-row no-gutters class="mb-4" v-if="team.players">
                <v-col cols="12" class="pa-0 ma-0">Heren</v-col>
                <v-col class="my-4">
                    <v-alert v-if="tooOldPlayers.male && tooOldPlayers.male.length > 0"
                             type="error"
                             dense
                             class="mb-0"
                             transition="scale-transition"
                             prominent
                    >
                        <div>Maximale leeftijd {{team.division}}-teams: {{team.max_age}} jaar</div>
                        <div v-for="(player, index) in tooOldPlayers.male" :key="index">
                            - {{player.fullname}} ({{player.knkv_age}})
                        </div>
                    </v-alert>
                </v-col>
                <multiselect
                        v-if="team.players.males"
                        v-model="team.players.males"
                        tag-placeholder="Kies speler"
                        placeholder="Zoek speler"
                        label="fullname" track-by="fullname"
                        :custom-label="customLabel"
                        :options="players"
                        :multiple="true"
                        :taggable="true"
                        @input="onChange(team.players.males, 'male')"
                ></multiselect>
            </v-row>
            <v-row no-gutters class="mb-4" v-if="team.players">
                <v-col cols="12" class="pa-0 ma-0">Dames</v-col>
                <v-col class="my-4">
                    <v-alert v-if="tooOldPlayers.female && tooOldPlayers.female.length > 0"
                             type="error"
                             dense
                             class="mb-0"
                             transition="scale-transition"
                             prominent
                    >
                        <div>Maximale leeftijd {{team.division}}-teams: {{team.max_age}} jaar</div>
                        <div v-for="(player, index) in tooOldPlayers.female" :key="index">
                            - {{player.fullname}} ({{player.knkv_age}})
                        </div>
                    </v-alert>
                </v-col>
                <multiselect
                        v-if="team.players.females"
                        v-model="team.players.females"
                        tag-placeholder="Kies speler"
                        placeholder="Zoek speler"
                        label="fullname" track-by="fullname"
                        :custom-label="customLabel"
                        :options="players"
                        :multiple="true"
                        :taggable="true"
                        @input="onChange(team.players.females, 'female')"
                ></multiselect>
            </v-row>

            <v-alert
                    v-if="(this.division.avg_age_limits) && (teamAvgAge < this.division.avg_age_limits.min || teamAvgAge > this.division.avg_age_limits.max)"
                    type="error"
                    color="purple"
                    dense
                    transition="scale-transition"
                    prominent
            >
                <div>Gemiddelde leeftijd {{team.division}}-teams tussen:
                    {{division.avg_age_limits.min}}-{{division.avg_age_limits.max}} jaar
                </div>
                <div> - Huidige opstelling: {{teamAvgAge.toFixed(1)}} jaar</div>
            </v-alert>

            <v-btn @click="updateTeam()" color="primary">
                <v-icon left>mdi-reload</v-icon>
                UPDATE
            </v-btn>
            <v-btn @click="deleteTeam()" color="error" outlined>
                <v-icon left>mdi-delete</v-icon>
                DELETE
            </v-btn>
        </v-form>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import {db} from './../firebase'
    import PlayerAPI from "../api/Player";
    import LogAPI from "../api/Log";
    import moment from 'moment'
    import DivisionAPI from "../api/Division";
    import {Team} from "../models/Team";

    export default {
        name: "EditTeam",
        data() {
            return {
                team: {},
                original_team: {},
                rules: {
                    required: value => !!value || 'Verplicht.',
                },
                valid: true,
                divisions: DivisionAPI.getAllDivisions(),
                players: [],
                tooOldPlayers: {},
                division: {},
                toggle_checkdate_btn: false,
                checkDateLabel: "Peildatum " + PlayerAPI.getCheckDate(true).format("YY") + "-" + PlayerAPI.getCheckDate(true).add(1, "year").format("YY"),
            }
        },
        firestore() {
            return {
                teamRef: {
                    ref: db.collection('teams').doc(this.$route.params.id),
                    resolve: (data) => {
                        this.team = data;
                        data.players.males.forEach((player, index) => {
                            player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate());
                            this.team.players.males[index] = player;
                        });
                        data.players.females.forEach((player, index) => {
                            player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate());
                            this.team.players.females[index] = player;
                        });
                        this.team.max_age = DivisionAPI.getDivisionMaxAge(this.team.division);
                        this.division.max_age_limit = this.team.max_age;
                        this.division.avg_age_limits = DivisionAPI.getDivisionAgeLimit(this.team.division);
                        if (this.team) {
                            this.original_team = JSON.parse(JSON.stringify(this.team))
                        }
                    }
                }
            }
        },
        computed: {
            teamAvgAge: function () {
                let ages = [];
                let avgAge = false;
                if (Object.keys(this.team).length !== 0 && this.team.constructor === Object) {
                    this.team.players.males.forEach(player => {
                        ages.push(player.knkv_age)
                    });
                    this.team.players.females.forEach(player => {
                        ages.push(player.knkv_age)
                    });
                    avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;
                }
                return avgAge;
            }
        },
        mounted() {
            this.players = PlayerAPI.getAll();
        },
        methods: {
            updateTeam() {
                if (JSON.stringify(this.team) !== JSON.stringify(this.original_team)) {
                    let team = new Team(this.team).toJSON();
                    this.$firestore.teamRef.update({...team});
                    LogAPI.updateTeam(this.original_team, this.team);
                }
                this.$router.push({name: 'Teams'})
            },
            deleteTeam() {
                if (confirm("Weet je zeker dat je dit team wilt verwijderen?") === true) {
                    this.$firestore.teamRef.delete().then(() => {
                        LogAPI.deleteTeam(this.team);
                        this.$router.push({name: 'Teams'})
                    })
                }
            },
            customLabel({fullname, knkv_age}) {
                return `${fullname} (${knkv_age})`
            },
            onChange(players, gender) {
                let tooOldPlayers = [];
                players.forEach(player => {
                    if (player.knkv_age > this.team.max_age) {
                        tooOldPlayers.push(player)
                    }
                });
                this.tooOldPlayers[gender] = tooOldPlayers;
            },
            toggleCheckDate(next) {
                this.team.players.males.forEach((player, index) => {
                    player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate(next));
                    this.team.players.males[index] = player;
                });
                this.team.players.females.forEach((player, index) => {
                    player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate(next));
                    this.team.players.females[index] = player;
                });
            },
        },
        filters: {
            moment: function (date, format) {
                return moment(date).format(format)
            }
        },
    }
</script>

<style scoped>

</style>
