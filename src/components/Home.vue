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
                                                <a href="https://knkv.sharepoint.com/downloads/Gedeelde%20%20documenten/Over%20KNKV/Organisatie/Organisatie/Statuten%20en%20reglementen/3_RvW.pdf"
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
                                                <a href="https://knkv.sharepoint.com/downloads/Gedeelde%20%20documenten/Competitie/Spelregels/Spelregelboek_2017.pdf"
                                                   target="_blank">
                                                    <v-icon left>mdi-pdf-box</v-icon>
                                                    Spelregels 2017
                                                </a>
                                            </v-list-item>
                                            <v-list-item>
                                                <a href="https://knkv.sharepoint.com/downloads/Gedeelde%20%20documenten/Competitie/Spelbepalingen.pdf"
                                                   target="_blank">
                                                    <v-icon left>mdi-pdf-box</v-icon>
                                                    Spelbepalingen
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
                                <v-chip small outlined>{{checkDate}}</v-chip>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col>
                <v-card outlined class="age_limits">
                    <v-card-title>Leeftijdsgrenzen</v-card-title>
                    <v-tabs v-model="tab" center-active>
                        <v-tab v-for="item in items" :key="item.id">{{item.title}}</v-tab>
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
                                        <v-chip x-small>{{checkDate}}</v-chip>
                                        geldt:
                                    </div>
                                    <v-list>
                                        <v-list-item>A-klasse tussen 15,1 en 18,0 jaar</v-list-item>
                                        <v-list-item>B-klasse tussen 13,1 en 15,0 jaar</v-list-item>
                                        <v-list-item>C-klasse tussen 11,1 en 13,0 jaar</v-list-item>
                                        <v-list-item>D-klasse tussen 9,1 en 11,0 jaar</v-list-item>
                                        <v-list-item>E-klasse tussen 7,1 en 9,0 jaar</v-list-item>
                                        <v-list-item>F-klasse tussen 5,1 en 7,0 jaar</v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text>
                                    <div>Behoudens het bepaalde in
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on" class="underlined_dotted">lid 1 onder b en lid 3</span>
                                            </template>
                                            <span>RvW: Artikel 8 </span>
                                        </v-tooltip>
                                        mogen in onderstaande klassen geen spelers, die op
                                        <v-chip x-small>{{checkDate}}</v-chip>
                                        de er achter vermelde leeftijd hebben, uitkomen:
                                    </div>
                                    <v-list>
                                        <v-list-item>A-klasse, spelers van 19 jaar of ouder</v-list-item>
                                        <v-list-item>B-klasse, spelers van 17 jaar of ouder</v-list-item>
                                        <v-list-item>C-klasse, spelers van 15 jaar of ouder</v-list-item>
                                        <v-list-item>D-klasse, spelers van 13 jaar of ouder</v-list-item>
                                        <v-list-item>E-klasse, spelers van 11 jaar of ouder</v-list-item>
                                        <v-list-item>F-klasse, spelers van 9 jaar of ouder</v-list-item>
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

    export default {
        name: "Home",
        data: () => ({
            checkDate: moment(PlayerAPI.getCheckDate()).format('DD-MM-YYYY'),
            tab: null,
            items: [
                {title: 'Teams', id: 1},
                {title: 'Spelers', id: 2},
            ]
        }),
        mounted() {
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
