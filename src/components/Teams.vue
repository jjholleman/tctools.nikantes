<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary"
               outlined link :to="{name: 'add-team'}">
          <v-icon left>mdi-plus</v-icon>
          Nieuw team
        </v-btn>
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
                <v-btn text x-small link :to="{path: '/team/'+team['.key']}">
                  <v-icon x-small left>mdi-pencil</v-icon>
                  Bewerken
                </v-btn>
              </v-col>
              <v-col cols="12">
                <div>Gemiddelde: {{ TeamAPI.getAgeData(team.players).average.toFixed(1) }} jaar</div>
                <div>Bandbreedte: {{ Math.round(Number(TeamAPI.getAgeData(team.players).bandwidth) * 100) / 100 }} jaar
                  [{{ TeamAPI.getAgeData(team.players).min.toFixed(1) }} ~
                  {{ TeamAPI.getAgeData(team.players).max.toFixed(1) }}]
                </div>
                <div>
                  Spelbepalingen: <span :class="[
                    `${{
                      Rood: 'red',
                      Oranje: 'orange',
                      Geel: 'yellow',
                      Blauw: 'blue',
                      Groen: 'green',
                      'Onbekend/Geen': 'grey'
                    }[team.ruleColor] || 'grey'}--text`,
                    'font-weight-bold'
                  ]">
                  {{ team.ruleColor }}
                </span>
                </div>
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
          <v-btn text x-small link :to="{path: '/team/'+selected['.key']}">
            <v-icon x-small left>mdi-pencil</v-icon>
            Bewerken
          </v-btn>
        </v-col>
        <v-col cols="12">
          <div>Gemiddelde: {{ TeamAPI.getAgeData(selected.players).average.toFixed(1) }} jaar</div>
          <div>Bandbreedte: {{ Math.round(Number(TeamAPI.getAgeData(selected.players).bandwidth) * 100) / 100 }} jaar
            [{{ TeamAPI.getAgeData(selected.players).min.toFixed(1) }} ~
            {{ TeamAPI.getAgeData(selected.players).max.toFixed(1) }}]
          </div>
          <div>
            Spelbepalingen: <span :class="[
                    `${{
                      Rood: 'red',
                      Oranje: 'orange',
                      Geel: 'yellow',
                      Blauw: 'blue',
                      Groen: 'green',
                      'Onbekend/Geen': 'grey'
                    }[selected.ruleColor] || 'grey'}--text`,
                    'font-weight-bold'
                  ]">
                  {{ selected.ruleColor }}
                </span>
          </div>
        </v-col>
        <v-col cols="12" v-if="selected.staff && selected.staff.length > 0">
          <v-subheader light>STAFF</v-subheader>
          <v-list v-if="selected.staff.length > 0">
            <v-list-item v-for="(person, index) in selected.staff" :key="index">
              {{ person }}
            </v-list-item>
          </v-list>
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

export default {
  name: "Teams",
  data() {
    return {
      teams: [],
      tab: null,
      selected: undefined,
      TeamAPI: TeamAPI,
    };
  },
  firestore() {
    return {
      teamsRef: {
        ref: db.collection('teams'),
        resolve: (data) => {
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
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
