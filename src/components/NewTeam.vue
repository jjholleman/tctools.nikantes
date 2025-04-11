<template>
    <v-container>
        <v-row no-gutters class="mb-8">
            <v-col>
                <v-btn x-small text link @click="$router.back()" color="primary"><v-icon left>mdi-arrow-left</v-icon>terug</v-btn>
            </v-col>
        </v-row>
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
            <v-text-field type="text"
                          label="Teamnaam"
                          v-model="team.name"
                          :rules="[rules.required]"
                          required
            ></v-text-field>
            <v-select label="Kleur spelbepaling"
                      v-model="team.ruleColor"
                      :rules="[rules.required]"
                      :items="ruleColors"
                      required
            ></v-select>
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
                ruleColors: ["Rood", "Oranje", "Geel", "Groen", "Blauw", "Onbekend/Geen"],
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
