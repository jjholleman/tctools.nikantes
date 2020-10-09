<template>
    <v-container v-if="this.player">
        <v-row no-gutters class="mb-8">
            <v-col>
                <v-btn x-small text link @click="$router.back()" color="primary">
                    <v-icon left>mdi-arrow-left</v-icon>
                    terug
                </v-btn>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col cols="12" class="mb-5">
                <h2>{{player.fullname}}</h2> <span>{{player.formatted_date_of_birth | moment("DD-MM-YYYY")}}</span>
            </v-col>
            <v-col cols="12">
                <p class="mb-0"><span class="font-weight-bold">Leeftijd:</span> <span>{{player.age}}</span></p>
                <p class="mb-0"><span class="font-weight-bold">Leeftijd (KNKV):</span> <span>{{player.knkv_age}}</span></p>
            </v-col>
            <v-col cols="12" class="mt-5">
                <p><span class="font-weight-bold">Laagst mogelijke team:</span> <span>{{player.limit_team}}</span></p>
            </v-col>
        </v-row>

        <v-row v-if="player['.key']">
            <v-col>
                <v-btn link :to="{name: 'EditPlayer', params: {id: player['.key']}}">
                    <v-icon left>mdi-pencil</v-icon>
                    BEWERKEN
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import {db} from './../firebase'
    import PlayerAPI from "../api/Player";
    import moment from 'moment'

    export default {
        name: "ShowPlayer",
        data() {
            return {
                player: {},
                original_player: {}
            }
        },
        firestore() {
            return {
                playerRef: {
                    ref: db.collection('players').doc(this.$route.params.id),
                    resolve: (data) => {
                        this.player = PlayerAPI.generateAdditionalPlayerData(data);
                        this.player.formatted_date_of_birth = moment(data.date_of_birth.toDate()).format('yyyy-MM-DD');
                        if (this.player) {
                            this.original_player = Object.assign({}, this.player);
                            document.title = this.player.fullname + " - " + this.$route.meta.title
                        }
                    }
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
