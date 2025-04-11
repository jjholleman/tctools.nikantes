<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
        <span
            v-bind="attrs"
            v-on="rule && rule !== ruleColors.none ? on : {}"
            class="font-weight-bold"
            :style="{ color: rule.color }"
        >{{ rule.name }}</span>
    </template>

    <div class="rule-details">
      <div class="d-flex mb-2" v-if="rule.vakken">
        <strong class="mr-2">Vakken:</strong>
        <span>{{ rule.vakken }}</span>
      </div>
      <div class="d-flex mb-2" v-if="rule.korf">
        <strong class="mr-2">Korfhoogte:</strong>
        <span>{{ rule.korf }} meter</span>
      </div>
      <div class="d-flex mb-2" v-if="rule.ball">
        <strong class="mr-2">Bal:</strong>
        <span>{{ rule.ball }}</span>
      </div>
      <div class="d-flex mb-2" v-if="rule.wisselen">
        <strong class="mr-2">Wisselen:</strong>
        <span>{{ rule.wisselen }}</span>
      </div>
    </div>

  </v-tooltip>
</template>

<script>
import TeamAPI from "@/api/Teams";

export default {
  name: 'RuleColorLabel',
  props: {
    ruleColor: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ruleColors: TeamAPI.getRuleColors(),
    };
  },
  computed: {
    rule() {
      return this.ruleColors[this.ruleColor] || {};
    },
  },
};
</script>
