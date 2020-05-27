<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <main>
        <v-alert type="warning" dismissible prominent>In Ontwikkeling</v-alert>
        <label class="typo__label">TeamBuilder</label>
        <multiselect
                v-model="selected"
                tag-placeholder="Kies speler"
                placeholder="Zoek speler"
                label="fullname" track-by="fullname"
                :custom-label="customLabel"
                :options="players"
                :multiple="true"
                :taggable="true"
        ></multiselect>
        <div class="average-age">Gemiddelde leeftijd: {{getAverageTeamAge()}}</div>
        <ul v-if="selected" class="selected-list">
            <li v-for="player in selected" :key="player.fullname">
                <div>{{player.firstname}}<span v-if="player.middlename != ''"> {{player.middlename}}</span>
                    {{player.lastname}}<span> ({{player.knkv_age}})</span><span> [{{player.limit_team}}]</span></div>
            </li>
        </ul>
        <pre class="language-json"><code>{{ selected  }}</code></pre>
    </main>
</template>

<script>
    /* eslint-disable no-console */
    // import moment from "moment";
    import PlayerAPI from '@/api/Player'
    import DivisionAPI from '@/api/Division'
    import 'vue-multiselect/dist/vue-multiselect.min.css';

    export default {
        name: "TeamBuilder",
        data() {
            return {
                players: [],
                selected: []
            };
        },
        mounted() {
            this.divisions = DivisionAPI.getAllDivisions();
            this.players = PlayerAPI.getAll(true);
        },
        methods: {
            getAverageTeamAge() {
                let ages = [];
                this.selected.forEach(player => {
                    ages.push(player.knkv_age)
                });
                if (ages.length > 0) {
                    let sum = ages.reduce((previous, current) => current += previous);
                    return sum / ages.length;
                }
            },
            customLabel({fullname, knkv_age}) {
                return `${fullname} (${knkv_age})`
            }
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .typo__label {
        display: block;
        margin-top: 5px;
    }

    .average-age {
        margin-top: 20px;
        font-weight: bold;
    }

    .selected-list {
        list-style: none;
    }

    .language-json {
        background-color: lightgray;
    }
</style>
