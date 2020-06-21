<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <v-container>
        <v-row>
            <v-btn color="primary"
                   outlined link :to="{name: 'add-team'}">
                <v-icon left>mdi-account-multiple-plus</v-icon>
                Nieuw team
            </v-btn>
        </v-row>
        <v-row>
            <v-col>
                <div v-for="(team, index) in teams" :key="index">
                    <v-row>
                        {{team.division}} {{team.divrank}}
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    /* eslint-disable no-console */

    import {db} from "./../firebase";

    export default {
        name: "Teams",
        data() {
            return {
                teams: []
            };
        },
        firestore() {
            return {
                teamsRef: {
                    ref: db.collection('teams'),
                    resolve: (data) => {
                        this.teams = data
                    }
                }
            }
        },
        mounted() {

        },
        methods: {},
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
