<template>
    <v-container>
        <v-alert
                :value="alert"
                type="warning"
                prominent
                transition="scale-transition"
        >
            <v-row align="center">
                <v-col class="grow">{{alert_team_name}} bestaat al, wil je het bewerken?
                </v-col>
                <v-col class="shrink">
                    <v-btn link :to="{path: '/team/'+alert_team_id}">
                        <v-icon left>mdi-pencil</v-icon>
                        BEWERKEN
                    </v-btn>
                </v-col>
            </v-row>
        </v-alert>
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
            <v-btn @click="addTeam()" color="primary" :disabled="!valid">
                <v-icon left>mdi-account-plus</v-icon>
                TOEVOEGEN
            </v-btn>
        </v-form>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import {db} from './../firebase'
    import {Team} from "../models/Team";
    import DivisionAPI from "../api/Division";
    import LogAPI from "../api/Log";

    export default {
        name: "NewTeam",
        data() {
            return {
                team: {},
                rules: {
                    required: value => !!value || 'Verplicht.',
                },
                valid: true,
                divisions: DivisionAPI.getAllDivisions(),
                alert: false,
                alert_team_id: undefined,
                alert_team_name: undefined,
            }
        },
        firestore() {
            return {
                teamsRef: {
                    ref: db.collection('teams'),
                },
            }
        },
        methods: {
            addTeam() {
                if (this.$refs.form.validate()) {
                    let team = new Team(this.team).toJSON();
                    this.uniqueTeam(team).then(res => {
                        if (res === true) {
                            this.$firestore.teamsRef.add({...team}).then((docRef) => {
                                LogAPI.createTeam(team, docRef.id);
                                this.$router.push('/team/' + docRef.id)
                            })
                        } else {
                            this.alert = true;
                        }
                    });
                }
            },
            async uniqueTeam(team) {
                let inputname = team.division + team.divrank;
                try {
                    let unique = true;
                    await this.$firestore.teamsRef.get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const team = doc.data();
                            const teamname = team.division + team.divrank;
                            if (teamname === inputname) {
                                unique = doc.id;
                                this.alert_team_id = doc.id;
                                this.alert_team_name = teamname;
                            }
                        });
                    });
                    return unique;
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
</script>

<style scoped>

</style>
