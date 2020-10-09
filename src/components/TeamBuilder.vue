<template>
    <v-container v-if="this.team">
        <v-row class="mb-8" no-gutters>
            <v-switch :label="checkDateLabel"
                      @change="toggleCheckDate(toggle_checkdate_btn)"
                      class="d-flex mt-1 mt-sm-1 pa-2"
                      dense
                      hide-details
                      inset
                      v-model="toggle_checkdate_btn"/>
        </v-row>
        <v-alert
                color="purple"
                dense
                prominent
                transition="scale-transition"
                type="error"
                v-if="(this.division.avg_age_limits) && (teamAvgAge < this.division.avg_age_limits.min || teamAvgAge > this.division.avg_age_limits.max)"
        >
            <div>Gemiddelde leeftijd {{team.division}}-teams tussen:
                {{division.avg_age_limits.min}}-{{division.avg_age_limits.max}} jaar
            </div>
            <div> - Huidige opstelling: {{teamAvgAge.toFixed(1)}} jaar</div>
        </v-alert>
        <v-select
                :items="divisions"
                @change="onChangeSelectedDivision"
                item-text="name"
                label="Leeftijdsgroep"
                required
                v-model="team.division"
        ></v-select>
        <v-row class="mb-4" no-gutters v-if="team && team.players">
            <v-col class="pa-0 ma-0" cols="12">Heren</v-col>
            <v-col class="my-4">
                <v-alert class="mb-0"
                         dense
                         prominent
                         transition="scale-transition"
                         type="error"
                         v-if="tooOldPlayers.male && tooOldPlayers.male.length > 0"
                >
                    <div>Maximale leeftijd {{team.division}}-teams: {{team.max_age}} jaar</div>
                    <div :key="index" v-for="(player, index) in tooOldPlayers.male">
                        - {{player.fullname}} ({{player.knkv_age}})
                    </div>
                </v-alert>
            </v-col>
            <multiselect
                    :custom-label="customLabel"
                    :multiple="true"
                    :options="players"
                    :taggable="true"
                    @input="function() {updateTooOldPlayers(team.players.males, 'male'); startCombinePlayers()}"
                    label="fullname"
                    placeholder="Zoek speler"
                    tag-placeholder="Kies speler"
                    track-by="fullname"
                    v-if="team.players"
                    v-model="team.players.males"
            ></multiselect>
        </v-row>
        <v-row class="mb-4" no-gutters v-if="team.players">
            <v-col class="pa-0 ma-0" cols="12">Dames</v-col>
            <v-col class="my-4">
                <v-alert class="mb-0"
                         dense
                         prominent
                         transition="scale-transition"
                         type="error"
                         v-if="tooOldPlayers.female && tooOldPlayers.female.length > 0"
                >
                    <div>Maximale leeftijd {{team.division}}-teams: {{team.max_age}} jaar</div>
                    <div :key="index" v-for="(player, index) in tooOldPlayers.female">
                        - {{player.fullname}} ({{player.knkv_age}})
                    </div>
                </v-alert>
            </v-col>
            <multiselect
                    :custom-label="customLabel"
                    :multiple="true"
                    :options="players"
                    :taggable="true"
                    @input="function() {updateTooOldPlayers(team.players.females, 'female'); startCombinePlayers()}"
                    label="fullname"
                    placeholder="Zoek speler"
                    tag-placeholder="Kies speler"
                    track-by="fullname"
                    v-if="team.players.females"
                    v-model="team.players.females"
            ></multiselect>
        </v-row>
        <v-row v-if="illegalTeamCombinations.length > 0" class="pt-4" no-gutters>
            <v-col cols="12">
                <v-alert dense outlined type="error" class="mb-1">Onderstaande opstellingen zijn op geen enkel moment gedurende de wedstrijd toegestaan</v-alert>
            </v-col>
            <v-col v-for="(team, index) in illegalTeamCombinations" :key="index" cols="12" class="col-sm-6 col-md-4 col-lg-3">
                <v-list>
                    <v-list-item :key="iPlayer" class="mr-2" v-for="(player, iPlayer) in team" dense>
                        {{player.fullname}}
                    </v-list-item>
                </v-list>
            </v-col>
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
                teamCombinationsSize: 8,
                teamCombinations: [],
                illegalTeamCombinations: [],
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
            },
        },
        mounted() {
            this.players = PlayerAPI.getAll();
            this.setAgeLimits(this.team.division);
        },
        methods: {
            customLabel({fullname, knkv_age}) {
                return `${fullname} (${knkv_age})`
            },
            updateTooOldPlayers(players, gender) {
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
                this.division.teamSize = DivisionAPI.getDivisionTeamSize(division);
                this.updateTooOldPlayers(this.team.players.males, 'male');
                this.updateTooOldPlayers(this.team.players.females, 'female');
            },
            startCombinePlayers() {
                const players = [];
                this.illegalTeamCombinations = [];
                Object.keys(this.team.players).forEach(gender => {
                    this.team.players[gender].forEach(player => {
                        players.push(player);
                    })
                });
                if (players.length >= 4) {
                    this.teamCombinations = [];
                    if (this.team.division === "D" && (players.length >= 4 && players.length < 8)) { // D 4Korfbal exception.
                        this.teamCombinationsSize = 4;
                    } else {
                        this.teamCombinationsSize = this.division.teamSize;
                    }
                    this.teamCombinations = this.k_combinations(players, this.teamCombinationsSize);
                    this.illegalTeamCombinations = this.getIllegalTeamCombinations(this.teamCombinations, this.division.avg_age_limits.max);
                }
            },
            k_combinations(set, k) {
                let i, j, combs, head, tailcombs;

                // There is no way to take e.g. sets of 5 elements from a set of 4.
                if (k > set.length || k <= 0) {
                    return [];
                }

                // K-sized set has only one K-sized subset.
                if (k === set.length) {
                    return [set];
                }

                // There is N 1-sized subsets in a N-sized set.
                if (k === 1) {
                    combs = [];
                    for (i = 0; i < set.length; i++) {
                        combs.push([set[i]]);
                    }
                    return combs;
                }
                combs = [];
                for (i = 0; i < set.length - k + 1; i++) {
                    // head is a list that includes only our current element.
                    head = set.slice(i, i + 1);
                    // We take smaller combinations from the subsequent elements
                    tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
                    // For each (k-1)-combination we join it with the current
                    // and store it to the set of k-combinations.
                    for (j = 0; j < tailcombs.length; j++) {
                        combs.push(head.concat(tailcombs[j]));
                    }
                }
                return combs;
            },
            getIllegalTeamCombinations(combinations, maxAvg) {
                const illegalTeams = [];
                combinations.forEach(team => {
                    const avgAge = this.getTeamAvgAge(team);
                    if (avgAge > maxAvg) {
                        illegalTeams.push(team);
                    }
                });
                return illegalTeams;
            },
            getTeamAvgAge(team) {
                const ages = [];
                team.forEach(player => {
                    ages.push(player.knkv_age);
                });
                return ages.reduce((a, b) => a + b, 0) / ages.length;
            },
            onChangeSelectedDivision(division) {
                this.setAgeLimits(division);
                this.startCombinePlayers();
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
