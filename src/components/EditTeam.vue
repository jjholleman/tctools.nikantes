<template>
  <v-container v-if="this.team">
    <v-row no-gutters class="mb-8">
      <v-col>
        <v-btn x-small text link @click="$router.back()" color="primary">
          <v-icon left>mdi-arrow-left</v-icon>
          terug
        </v-btn>
      </v-col>
      <v-switch v-model="toggle_checkdate_btn"
                hide-details
                inset
                dense
                class="d-inline-flex mt-1 mt-sm-1 pa-2"
                @change="toggleCheckDate(toggle_checkdate_btn)"
                :label="checkDateLabel"/>
    </v-row>
    <v-form ref="form" v-model="valid" :lazy-validation="true">
      <v-text-field type="text"
                    label="Teamnaam"
                    v-model="team.name"
                    :rules="[rules.required]"
                    required
      ></v-text-field>
      <v-select
          label="Kleur spelbepaling"
          v-model="team.ruleColor"
          :rules="[rules.required]"
          required
          :items="ruleColors"
          item-text="Kleur"
      ></v-select>

      <v-row no-gutters class="mb-4" v-if="team.players">
        <v-col cols="12" class="pb-4 ma-0">
          <v-chip>Spelers</v-chip>
        </v-col>
        <multiselect
            v-if="team.players"
            v-model="team.players"
            tag-placeholder="Kies speler"
            placeholder="Zoek speler"
            label="fullname" track-by="fullname"
            :custom-label="customLabel"
            :options="players"
            :multiple="true"
            :taggable="true"
        ></multiselect>
      </v-row>

      <v-alert
          v-if="(team.players && team.players.length == 4 && teamAgeData.bandwidth > 2) || teamAgeData.bandwidth > 3"
          color="red"
          dense
          prominent
          transition="scale-transition"
          type="error"
      >
        <div class="font-weight-bold">
          Bandbreedte: {{Math.round(Number(teamAgeData.bandwidth)*100)/100}} jaar  [{{teamAgeData.min.toFixed(1)}} ~ {{teamAgeData.max.toFixed(1)}}]
        </div>
      </v-alert>

      <v-row>
        <v-col cols="12" class="pb-2">
          <div class="pb-4">
            <v-chip>Staff</v-chip>
          </div>
          <v-list dense class="py-0 pb-3" v-if="staff.length > 0">
            <v-row>
              <v-list-item dense v-for="(name, i) in staff" :key="i"
                           class="d-inline-flex col py-0 flex-shrink-1 flex-grow-0">
                <v-btn small text @click="deleteFromStaff(name)">{{ name }}
                  <v-icon right small>mdi-alpha-x-box</v-icon>
                </v-btn>
              </v-list-item>
            </v-row>
          </v-list>
          <v-subheader v-if="staff.length === 0" class="pl-4 py-1 pb-3">Geen</v-subheader>
        </v-col>
        <v-col cols="12" class="col-sm-9 col-md-7 col-lg-5 py-0">
          <v-form v-on:submit.prevent="addStaff">
            <v-text-field label="Staff toevoegen (naam)" v-model="staffInput" outlined>
              <template v-slot:append-outer v-if="staffInput">
                <v-icon color="green" @click="addStaff" size="28">mdi-plus-box</v-icon>
              </template>
            </v-text-field>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="flex-shrink-1 flex-grow-0">
          <v-btn @click="updateTeam()" color="primary">
            <v-icon left>mdi-reload</v-icon>
            UPDATE
          </v-btn>
        </v-col>
        <v-col>
          <v-btn @click="deleteTeam()" color="error" outlined>
            <v-icon left>mdi-delete</v-icon>
            DELETE
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

import {db} from './../firebase'
import PlayerAPI from "../api/Player";
import LogAPI from "../api/Log";
import moment from 'moment'
import TeamAPI from "../api/Teams";
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
      ruleColors: ["Rood", "Oranje", "Geel", "Groen", "Blauw", "Onbekend/Geen"],
      players: [],
      staffInput: "",
      staff: [],
      toggle_checkdate_btn: false,
      checkDateLabel: "Peildatum " + PlayerAPI.getCheckDate(true).format("YY") + "-" + PlayerAPI.getCheckDate(true).add(1, "year").format("YY"),
    }
  },
  firestore() {
    return {
      teamRef: {
        ref: db.collection('teams').doc(this.$route.params.id),
        resolve: (data) => {
          this.team = data;
          data.players.forEach((player, index) => {
            player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate());
            this.team.players[index] = player;
          });
          if (this.team) {
            this.original_team = JSON.parse(JSON.stringify(this.team))
          }
          if (this.team.staff) this.staff = this.team.staff;
        }
      }
    }
  },
  computed: {
    teamAgeData: function () {
      let data = {
        average: null,
        bandwidth: null,
        min: null,
        max: null,
      }

      if (Object.keys(this.team).length !== 0 && this.team.constructor === Object) {
        data = TeamAPI.getAgeData(this.team.players)
      }

      return data
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
      return `${fullname} (${knkv_age.toFixed(1)})`
    },
    toggleCheckDate(next) {
      this.team.players.forEach((player, index) => {
        player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate(next));
        this.team.players[index] = player;
      });
      this.players.forEach((player, index) => {
        player = PlayerAPI.getPlayerKNKVAge(player, PlayerAPI.getCheckDate(next));
        this.players[index] = player;
      });
    },
    addStaff() {
      let value = this.staffInput;
      if (value !== "") {
        let dupe = false;
        this.staff.forEach(a => {
          if (a === value) dupe = true;
        });
        if (!dupe) {
          this.staff.push(value);
          this.staffInput = "";
          this.team.staff = this.staff;
        }
      }
    },
    deleteFromStaff(value) {
      this.staff = this.staff.filter(a => a !== value);
      this.team.staff = this.staff;
    },
  },
  filters: {
    moment: function (date, format) {
      return moment(date).format(format)
    }
  },
}
</script>

<style scoped>
.v-list-item--dense, .v-list--dense .v-list-item {
  min-height: 0;
}

.v-subheader {
  height: auto;
}
</style>
