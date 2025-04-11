<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-row no-gutters>
          <v-col cols="12" class="quick-links">
            <v-card outlined>
              <v-expansion-panels flat>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span><v-icon>mdi-file-document-outline</v-icon> Documenten</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item>
                        <a href="./documents/3_RvW.pdf"
                           target="_blank">
                          <v-icon left>mdi-pdf-box</v-icon>
                          Reglement van Wedstrijden
                        </a>
                      </v-list-item>
                      <v-list-item>
                        <a href="https://www.knkv.nl/node/17970" target="_blank">
                          <v-icon left>mdi-file-document-outline</v-icon>
                          RvW 3.03 RB jeugdkorfbal
                        </a>
                      </v-list-item>
                      <v-list-item>
                        <a href="./documents/Spelregelboek_2017.pdf"
                           target="_blank">
                          <v-icon left>mdi-pdf-box</v-icon>
                          Spelregels 2017
                        </a>
                      </v-list-item>
                      <v-list-item>
                        <a href="./documents/Spelbepalingen.pdf"
                           target="_blank">
                          <v-icon left>mdi-pdf-box</v-icon>
                          Spelbepalingen
                        </a>
                      </v-list-item>
                      <v-list-item>
                        <a href="./documents/Samenvatting Competitie 2.0.pdf"
                           target="_blank">
                          <v-icon left>mdi-pdf-box</v-icon>
                          Samenvatting Competitie 2.0
                        </a>
                      </v-list-item>
                      <v-list-item>
                        <a href="./documents/Spelbepalingen Competitie 2.0.pdf"
                           target="_blank">
                          <v-icon left>mdi-pdf-box</v-icon>
                          Spelbepalingen Competitie 2.0
                        </a>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined class="checkdate">
              <v-card-title>Peildatum</v-card-title>
              <v-card-text>
                De datum van het desbetreffende competitieseizoen die wordt gehanteerd om de gemiddelde
                leeftijd
                voor ploegen die deelnemen aan een klasse van de jeugdkorfbalcompetitie te berekenen.
                De huidige peildatum valt op
                <v-chip small outlined>{{ checkDate }}</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined class="ruleColors">
              <v-card-title>Spelbepalingen Competitie 2.0</v-card-title>
              <v-card-text>
                <v-simple-table>
                  <thead>
                  <tr>
                    <th>Kleur</th>
                    <th>Vakken</th>
                    <th>Korfhoogte</th>
                    <th>Bal</th>
                    <th>Wisselen</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(rule, key) in filteredRuleColors"
                      :key="key"
                      :style="{ backgroundColor: rule.color, color: 'white'}"
                  >
                    <td>{{ rule.name }}</td>
                    <td>{{ rule.vakken }}</td>
                    <td>{{ rule.korf }} meter</td>
                    <td>{{ rule.ball }}</td>
                    <td>{{ rule.wisselen }}</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-card outlined class="age_limits">
          <v-card-title>Leeftijdsgrenzen Competitie 2.0</v-card-title>
          <v-tabs v-model="tab" center-active>
            <v-tab v-for="item in itemsCompetitie2" :key="item.id">{{ item.title }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div>De gemiddelde leeftijd van de spelers dient op ieder moment in elke
                    afzonderlijke wedstrijd
                    per klasse tussen de voor de desbetreffende klasse geldende uitersten te liggen,
                    waarbij
                    voor de afzonderlijke leeftijden van de spelers de leeftijd op de peildatum van
                    <v-chip x-small>{{ checkDate }}</v-chip>
                    geldt:
                  </div>
                  <v-list>
                    <v-list-item>Teams worden ingedeeld met een maximaal leeftijdsverschil (de ‘bandbreedte’) tussen de
                      jongste en de oudste speler
                    </v-list-item>
                    <v-list-item>Deze bandbreedte is maximaal 2 jaar bij 4-tallen en maximaal 3 jaar bij 8-tallen
                    </v-list-item>
                    <v-list-item>Vanaf een gemiddelde leeftijd van 9,0 jaar mag een 8-tal worden gevormd</v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div>Voor invallers gelden de volgende regels:</div>
                  <v-list>
                    <v-list-item>Spelers die jonger zijn dan de gemiddelde leeftijd van het team, mogen altijd invallen
                    </v-list-item>
                    <v-list-item>Een invaller is maximaal 1,5 jaar ouder dan de gemiddelde leeftijd van het team óf
                      heeft dezelfde
                      exacte leeftijd als de oudste speler van het opgegeven team.
                      Wanneer de oudste speler meer dan 1,5 jaar ouder is dan de gemiddelde teamleeftijd, dan geldt
                      zijn/haar leeftijd als maximale leeftijd voor een invaller
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayerAPI from "../api/Player";
import * as moment from "moment";
import TeamApi from "../api/Teams";

export default {
  name: "Home",
  data: () => ({
    checkDate: moment(PlayerAPI.getCheckDate()).format('DD-MM-YYYY'),
    tab: null,
    items: [
      {title: 'Teams', id: 1},
      {title: 'Spelers', id: 2},
    ],
    itemsCompetitie2: [
      {title: 'Teams', id: 1},
      {title: 'Invallers', id: 2},
    ],
    ruleColors: TeamApi.getRuleColors(),
  }),
  mounted() {
  },
  computed: {
    filteredRuleColors() {
      return Object.entries(this.ruleColors)
          .filter(([key]) => key !== 'none')
          .map(([, rule]) => rule);
    }
  }
}
</script>

<style scoped lang="scss">
.underlined_dotted {
  text-decoration: underline dotted;
}

.quick-links {
  margin-bottom: 24px;

  a {
    text-decoration: none;
  }
}
</style>
