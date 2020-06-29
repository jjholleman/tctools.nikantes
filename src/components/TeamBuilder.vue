<template>
    <v-container v-if="this.team">
        <v-row no-gutters class="mb-8">
            <v-switch v-model="toggle_checkdate_btn"
                      hide-details
                      inset
                      dense
                      class="d-flex mt-1 mt-sm-1 pa-2"
                      @change="toggleCheckDate(toggle_checkdate_btn)"
                      :label="checkDateLabel"/>
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
        <v-select
                label="Leeftijdsgroep"
                v-model="team.division"
                required
                :items="divisions"
                item-text="name"
                @change="setAgeLimits"
        ></v-select>
        <v-row no-gutters class="mb-4" v-if="team && team.players">
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
                    v-if="team.players"
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
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import PlayerAPI from "../api/Player";
    import moment from 'moment'
    import DivisionAPI from "../api/Division";

    export default {
        name: "TeamBuilder",
        data() {
            return {
                team: {
                    players: {
                        males: [],
                        females: [],
                    },
                    division: "Senioren",
                },
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
            this.setAgeLimits(this.team.division);
        },
        methods: {
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
                this.players.forEach((player, index) => {
                    player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate(next));
                    this.players[index] = player;
                });
            },
            setAgeLimits(division) {
                this.team.max_age = DivisionAPI.getDivisionMaxAge(division);
                this.division.max_age_limit = this.team.max_age;
                this.division.avg_age_limits = DivisionAPI.getDivisionAgeLimit(division);
            }
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
