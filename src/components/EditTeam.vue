<template>
    <v-container v-if="this.team">
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
                Heren
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
                ></multiselect>
            </v-row>
            <v-row no-gutters class="mb-4" v-if="team.players">
                Dames
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
                ></multiselect>
            </v-row>


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
            }
        },
        firestore() {
            return {
                teamRef: {
                    ref: db.collection('teams').doc(this.$route.params.id),
                    resolve: (data) => {
                        this.team = data;
                        if (this.team) {
                            this.original_team = JSON.parse(JSON.stringify(this.team))
                        }
                    }
                }
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
            }
        },
        filters: {
            moment: function (date, format) {
                return moment(date).format(format)
            }
        }
    }
</script>

<style scoped>

</style>
