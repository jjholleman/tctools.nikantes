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

    <v-card v-if="teamAgeData.average && teamAgeData.bandwidth"
            outlined elevation="0" class="mb-4 pa-2" style="font-size: 0.9rem;">
      <v-row dense align="center" class="px-2">
        <v-col cols="12" sm="4" class="text-sm-left">
          <v-icon left small color="primary">mdi-account-group</v-icon>
          <strong>Gemiddelde:</strong> {{ teamAgeData.average.toFixed(1) }} jaar
        </v-col>
        <v-col cols="12" sm="4" class="text-sm-center">
          <v-icon left small color="primary">mdi-ruler</v-icon>
          <strong>Bandbreedte:</strong>
          {{ teamAgeData.bandwidth.toFixed(2) }} jaar
          ({{ teamAgeData.min.toFixed(1) }} – {{ teamAgeData.max.toFixed(1) }})
        </v-col>
        <v-col cols="12" sm="4" class="text-sm-right">
          <v-icon left small color="primary">mdi-account-check</v-icon>
          <strong>Max. invaller:</strong> {{ maxAllowedReserveAge.toFixed(1) }} jaar
        </v-col>
      </v-row>
    </v-card>

    <v-select label="Kleur spelbepaling"
              v-model="team.ruleColor"
              :rules="[rules.required]"
              :items="colorOptions"
              item-text="name"
              item-value="value"
              required
    ></v-select>

    <v-row no-gutters class="mb-4" v-if="players">
      <v-col cols="12" class="pb-4 ma-0">
        <v-chip>Basis Spelers</v-chip>
      </v-col>
      <multiselect
          v-if="players"
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
    <v-row no-gutters class="mb-4" v-if="players">
      <v-col cols="12" class="pb-4 ma-0">
        <v-chip>Invallers</v-chip>
      </v-col>
      <multiselect
          v-model="team.reserves"
          tag-placeholder="Kies reserve speler"
          placeholder="Zoek reserve speler"
          label="fullname" track-by="id"
          :custom-label="customLabel"
          :options="reserveOptions"
          :multiple="true"
          :taggable="true"
          @input="validateReserves"
      />
    </v-row>

    <v-alert
        v-if="
          (team.ruleColor && ['blue', 'green'].includes(team.ruleColor) && teamAgeData.bandwidth > 2)
          || teamAgeData.bandwidth > 3"
        color="red"
        dense
        prominent
        transition="scale-transition"
        type="error"
    >
      <div class="font-weight-bold">
        Bandbreedte: {{ Math.round(Number(teamAgeData.bandwidth) * 100) / 100 }} jaar
        [{{ teamAgeData.min.toFixed(1) }} ~ {{ teamAgeData.max.toFixed(1) }}]
      </div>
      <div v-if="team.ruleColor && ['blue', 'green'].includes(team.ruleColor)">
        De maximale bandbreedte bij 4-tallen (blauw en groen) is 2 jaar.
      </div>
    </v-alert>
    <v-alert
        v-if="team.ruleColor
          && ['red', 'orange', 'yellow'].includes(team.ruleColor)
          && teamAgeData.average
          && teamAgeData.average < 9"
        color="black"
        dense
        prominent
        transition="scale-transition"
        type="error"
    >
      <div class="font-weight-bold">Pas vanaf een gemiddelde leeftijd van 9,0 jaar mag een 8-tal worden gevormd</div>
      <div>Huidige gemiddelde leeftijd van het team: {{ teamAgeData.average.toFixed(1) }}</div>
    </v-alert>
    <v-alert
        v-if="invalidReserves.length > 0"
        color="red"
        dense
        prominent
        transition="scale-transition"
        type="error"
    >
      <div class="font-weight-bold">Ongeldige reserves:</div>
      <div class="mb-2">
        Reserves moeten jonger zijn dan het gemiddelde ({{ teamAgeData.average.toFixed(1) }} jaar) <br>
        of niet ouder dan <strong>{{ maxAllowedReserveAge.toFixed(1) }} jaar</strong>.
      </div>
      <ul class="mb-0">
        <li v-for="player in invalidReserves" :key="player.fullname">
          {{ player.fullname }} ({{ player.knkv_age.toFixed(1) }} jaar) is ouder dan toegestaan.
        </li>
      </ul>
    </v-alert>

  </v-container>
</template>

<script>
/* eslint-disable no-console */

import PlayerAPI from "../api/Player";
import moment from 'moment'
import TeamAPI from "@/api/Teams";

export default {
  name: "TeamBuilder",
  props: {
    base_team: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        required: value => !!value || 'Verplicht.',
      },
      TeamAPI: TeamAPI,
      team: {},
      original_team: {},
      ruleColors: TeamAPI.getRuleColors(),
      players: [],
      staffInput: "",
      staff: [],
      toggle_checkdate_btn: false,
      checkDateLabel: "Peildatum " + PlayerAPI.getCheckDate(true).format("YY") + "-" + PlayerAPI.getCheckDate(true).add(1, "year").format("YY"),
      invalidReserves: [],
      maxAllowedReserveAge: null,
    }
  },
  computed: {
    reserveOptions() {
      const baseIds = Array.isArray(this.team.players)
          ? this.team.players.map(p => p.id)
          : [];

      return this.players.filter(player => !baseIds.includes(player.id));
    },
    teamAgeData: function () {
      let data = {
        average: null,
        bandwidth: null,
        min: null,
        max: null,
      }

      if (Object.keys(this.team).length !== 0 && this.team.players && Object.keys(this.team.players).length !== 0 && this.team.constructor === Object) {
        data = TeamAPI.getAgeData(this.team.players)
      }

      return data
    },
    colorOptions() {
      return Object.entries(this.ruleColors).map(([key, value]) => ({
        value: key,
        name: value.name,
      }));
    },
  },
  mounted() {
    if (this.base_team) {
      this.team = this.base_team;
    }
    this.players = PlayerAPI.getAll();
  },
  watch: {
    'team.players': {
      handler() {
        this.validateReserves();
      },
      deep: true
    },
    'team.reserves': {
      handler() {
        this.validateReserves();
      },
      deep: true
    }
  },
  methods: {
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
    validateReserves() {
      this.invalidReserves = [];

      if (!this.team?.players?.length) {
        this.maxAllowedReserveAge = null;
        return;
      }

      const ages = this.team.players.map(p => p.knkv_age);
      const average = ages.reduce((sum, age) => sum + age, 0) / ages.length;
      const oldest = Math.max(...ages);
      const maxAllowed = Math.max(average + 1.5, oldest);
      this.maxAllowedReserveAge = maxAllowed;

      if (!this.team?.reserves?.length) return;

      this.team.reserves.forEach(reserve => {
        const age = reserve.knkv_age;
        const isYounger = age < average;
        const isWithinRange = age <= maxAllowed;
        const isEqualToOldest = Math.abs(age - oldest) < 0.01;

        if (!isYounger && !isWithinRange && !isEqualToOldest) {
          this.invalidReserves.push(reserve);
        }
      });
    }
  },
  filters: {
    moment: function (date, format) {
      return moment(date).format(format)
    }
  },
}
</script>

<style scoped>

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
