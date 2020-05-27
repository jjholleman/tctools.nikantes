<template>
    <v-container>
        <v-text-field label="Voornaam" :value="this.player.firstname" v-model="player.firstname"></v-text-field>
        <v-text-field label="Tussenvoegsel" :value="this.player.middlename" v-model="player.middlename"></v-text-field>
        <v-text-field label="Achternaam" :value="this.player.lastname" v-model="player.lastname"></v-text-field>
        <v-text-field
                v-if="this.player.date_of_birth"
                label="Geboortedatum"
                :value="this.player.formatted_date_of_birth"
                v-model="player.formatted_date_of_birth"
                type="date">
        </v-text-field>
        <v-btn @click="updatePlayer()" color="primary"><v-icon left>mdi-reload</v-icon>UPDATE</v-btn>
        <v-btn @click="deletePlayer()" color="error" outlined><v-icon left>mdi-delete</v-icon>DELETE</v-btn>
    </v-container>
</template>

<script>
    import {db} from './../firebase'
    import PlayerAPI from "../api/Player";
    import moment from 'moment'
    import * as firebase from "firebase/app";

    export default {
        name: "EditPlayer",
        data() {
            return {
                player: {},
            }
        },
        firestore() {
            return {
                playerRef: {
                    ref: db.collection('players').doc(this.$route.params.id),
                    resolve: (data) => {
                        this.player = PlayerAPI.generateAdditionalPlayerData(data);
                        this.player.formatted_date_of_birth = moment(data.date_of_birth.toDate()).format('yyyy-MM-DD')
                    }
                }
            }
        },
        mounted() {

        },
        methods: {
            updatePlayer() {
                this.$firestore.playerRef.update({
                    firstname: this.player.firstname,
                    middlename: this.player.middlename,
                    lastname: this.player.lastname,
                    date_of_birth: firebase.firestore.Timestamp.fromDate(new Date(this.player.formatted_date_of_birth))
                });
                PlayerAPI.setAll();
                this.$router.push('/')
            },
            deletePlayer() {
                if(confirm("Weet je zeker dat je deze speler wilt verwijderen?") === true) {
                    this.$firestore.playerRef.delete().then(() => {
                        PlayerAPI.setAll();
                        this.$router.push('/')
                    })
                }
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
