<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
  <v-container>
    <v-row>
      <v-col class="flex-grow-0" cols="12" sm="auto" order-sm="2">
        <v-btn color="primary"
               outlined link :to="{name: 'add-team'}">
          <v-icon left>mdi-plus</v-icon>
          Nieuw team
        </v-btn>
      </v-col>
      <v-col>
        <v-switch v-model="toggle_checkdate_btn"
                  hide-details
                  class="d-inline-flex mt-1 mt-sm-1 pa-2"
                  @change="toggleCheckDate(toggle_checkdate_btn)"
                  :label="checkDateLabel"/>
      </v-col>
    </v-row>
    <v-row class="hidden-sm-and-down">
      <v-col>
        <v-tabs show-arrows background-color="primary" dark v-model="tab">
          <v-tab v-for="(team, index) in teams" :key="index">{{ team.name }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(team, index) in teams" :key="index">
            <v-row class="pl-2">
              <v-col cols="12">
                <v-btn color="primary" outlined small class="mr-2" @click="editInTeamBuilder(team)">
                  <v-icon small left>mdi-account-hard-hat</v-icon>
                  Gebruik in Teambuilder
                </v-btn>
                <v-btn outlined text small link :to="{path: '/team/'+team['.key']}">
                  <v-icon small left>mdi-pencil</v-icon>
                  Bewerken
                </v-btn>
              </v-col>

              <v-col cols="12">
                <v-card
                    outlined
                    elevation="0"
                    class="mb-4 pa-2"
                    style="font-size: 0.9rem;"
                    v-if="team.players && TeamAPI.getAgeData(team.players).average"
                >
                  <v-row dense align="center" class="px-2">
                    <v-col cols="12" sm="4" lg="12" class="text-sm-left text-lg-left">
                      <v-icon left small color="primary">mdi-account-group</v-icon>
                      <strong>Gemiddelde:</strong>
                      {{ TeamAPI.getAgeData(team.players).average.toFixed(1) }} jaar
                    </v-col>
                    <v-col cols="12" sm="4" lg="12" class="text-sm-center text-lg-left">
                      <v-icon left small color="primary">mdi-ruler</v-icon>
                      <strong>Bandbreedte:</strong>
                      {{ TeamAPI.getAgeData(team.players).bandwidth.toFixed(2) }} jaar
                      ({{ TeamAPI.getAgeData(team.players).min.toFixed(1) }} – {{ TeamAPI.getAgeData(team.players).max.toFixed(1) }})
                    </v-col>
                    <v-col cols="12" sm="4" lg="12" class="text-sm-right text-lg-left">
                      <v-icon left small color="primary">mdi-check-decagram</v-icon>
                      <strong>Spelbepalingen: </strong>
                      <RuleColorLabel :ruleColor="team.ruleColor" />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12" v-if="team.staff && team.staff.length > 0">
                <v-subheader light>STAFF</v-subheader>
                <v-list v-if="team.staff.length > 0">
                  <v-list-item v-for="(person, index) in team.staff" :key="index">
                    {{ person }}
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="4" class="flex-shrink-1 flex-grow-0">
                <v-subheader light>SPELERS</v-subheader>
                <v-list v-if="team.players.length > 0">
                  <v-list-item v-for="(player, index) in team.players" :key="index" link
                               :to="{name: 'player', params: {id: player.id}}">
                    {{ player.fullname }} ({{ Number(player.knkv_age).toFixed(1) }})
                  </v-list-item>
                </v-list>
                <v-list-item v-else>
                  Geen spelers
                </v-list-item>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-container class="d-md-none pa-0">
      <v-row>
        <v-col cols="12" class="col-sm-8">
          <v-combobox
              :items="this.teams"
              item-text="name"
              label="Selecteer een team..."
              v-model="selected"
              hide-details="true"
          >
          </v-combobox>
        </v-col>
      </v-row>
      <v-row class="pl-2" v-if="selected">
        <v-col cols="12">
          <v-btn color="primary" outlined small class="mr-2" @click="editInTeamBuilder(selected)">
            <v-icon small left>mdi-account-hard-hat</v-icon>
            Gebruik in Teambuilder
          </v-btn>
          <v-btn outlined small link :to="{path: '/team/'+selected['.key']}">
            <v-icon small left>mdi-pencil</v-icon>
            Bewerken
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-card
              outlined
              elevation="0"
              class="mb-4 pa-2"
              style="font-size: 0.9rem;"
              v-if="selected.players && TeamAPI.getAgeData(selected.players).average"
          >
            <v-row dense align="center" class="px-2">
              <v-col cols="12" sm="4" class="text-sm-left">
                <v-icon left small color="primary">mdi-account-group</v-icon>
                <strong>Gemiddelde:</strong>
                {{ TeamAPI.getAgeData(selected.players).average.toFixed(1) }} jaar
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-center">
                <v-icon left small color="primary">mdi-ruler</v-icon>
                <strong>Bandbreedte:</strong>
                {{ TeamAPI.getAgeData(selected.players).bandwidth.toFixed(2) }} jaar
                ({{ TeamAPI.getAgeData(selected.players).min.toFixed(1) }} – {{ TeamAPI.getAgeData(selected.players).max.toFixed(1) }})
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-right">
                <v-icon left small color="primary">mdi-check-decagram</v-icon>
                <strong>Spelbepalingen: </strong>
                <RuleColorLabel :ruleColor="selected.ruleColor" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" class="flex-shrink-1 flex-grow-0 col-sm-auto flex-sm-shrink-1">
          <v-subheader light>SPELERS</v-subheader>
          <v-list v-if="selected.players.length > 0">
            <v-list-item v-for="(player, index) in selected.players" :key="index" link
                         :to="{name: 'player', params: {id: player.id}}">
              {{ player.fullname }} ({{ Number(player.knkv_age).toFixed(1) }})
            </v-list-item>
          </v-list>
          <v-list-item v-else>
            Geen spelers
          </v-list-item>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

import {db} from "./../firebase";
import TeamAPI from "../api/Teams";
import PlayerAPI from "../api/Player";
import RuleColorLabel from "@/components/partials/RuleColorLabel.vue";

export default {
  name: "Teams",
  components: {RuleColorLabel},
  data() {
    return {
      teams: [],
      tab: null,
      selected: undefined,
      TeamAPI: TeamAPI,
      PlayerAPI: PlayerAPI,
      ruleColors: TeamAPI.getRuleColors(),
      toggle_checkdate_btn: false,
      checkDate: PlayerAPI.getCheckDate(),
      nextCheckDate: PlayerAPI.getCheckDate(true),
      checkDateLabel: "Peildatum " + PlayerAPI.getCheckDate(true).format("YY") + "-" + PlayerAPI.getCheckDate(true).add(1, "year").format("YY"),
    };
  },
  firestore() {
    return {
      teamsRef: {
        ref: db.collection('teams'),
        resolve: (data) => {
          data.forEach((team) => {
            team.players.forEach((player) => {
              return PlayerAPI.getPlayerKNKVAge(player)
            })
          })

          this.teams = data;
          this.sortTeams(this.teams);
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    sortTeams(teams) {
      teams.sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      })
    },
    editInTeamBuilder(team) {
      this.$router.push({
        name: 'TeamBuilder',
        query: {
          base_team: JSON.stringify(team),
        }
      })
    },
    toggleCheckDate(next) {
      let checkDate = this.checkDate;
      if (next === true) {
        checkDate = this.nextCheckDate;
      }
      this.teams.forEach((team) => {
        team.players.forEach((player) => {
          return PlayerAPI.getPlayerKNKVAge(player, checkDate)
        })
      })
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
