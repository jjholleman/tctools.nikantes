<template>
    <v-container>
        <v-form ref="form" v-model="valid" :lazy-validation="true">
            <v-text-field label="Voornaam" v-model="player.firstname" :rules="[rules.required]" required></v-text-field>
            <v-text-field label="Tussenvoegsel" v-model="player.middlename"></v-text-field>
            <v-text-field label="Achternaam" v-model="player.lastname" :rules="[rules.required]" required></v-text-field>
            <v-text-field
                    label="Geboortedatum"
                    v-model="player.formatted_date_of_birth"
                    type="date"
                    :rules="[rules.required]"
                    required>
            </v-text-field>
            <v-btn @click="addPlayer()" color="primary" :disabled="!valid"><v-icon left>mdi-account-plus</v-icon>TOEVOEGEN</v-btn>
        </v-form>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import {db} from './../firebase'
    import * as firebase from "firebase/app";
    import LogAPI from "../api/Log";

    export default {
        name: "NewPlayer",
        data() {
            return {
                player: {},
                rules: {
                    required: value => !!value || 'Verplicht.',
                },
                valid: true
            }
        },
        firestore() {
            return {
                playersRef: {
                    ref: db.collection('players')
                }
            }
        },
        methods: {
            addPlayer() {
                if(this.$refs.form.validate()) {
                    this.$firestore.playersRef.add({
                        firstname: this.player.firstname,
                        middlename: this.player.middlename || "",
                        lastname: this.player.lastname,
                        date_of_birth: firebase.firestore.Timestamp.fromDate(new Date(this.player.formatted_date_of_birth))
                    }).then((docRef) => {
                        LogAPI.createPlayer(this.player, docRef.id);
                        this.$router.push('/player/'+ docRef.id)
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
