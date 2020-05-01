<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <main>
        <router-link to="/teambuilder">Ga naar TeamBuilder</router-link>
        <div class="search-wrapper">
            <label>
                <input type="text" v-model="search" placeholder="Zoek speler..."/>
                <div class="search"></div>
            </label>
        </div>
        <span
                class="description"
        >Het team waaronder een speler vermeldt staat is het LAAGSTE team waar het voor mag uitkomen.</span>
        <span class="peildatum">Peildatum {{checkdate.format("DD-MM-YYYY")}}</span>
        <button class="nextCheck-btn" @click="useNextCheckDate()">Peildatum instellen op nieuw seizoen</button>

        <div class="members-table-container">
            <table class="members-table">
                <thead>
                <tr>
                    <th @click="sortMembersTable('firstname')">Naam</th>
                    <th @click="sortMembersTable('limit_team')">Team</th>
                    <th @click="sortMembersTable('knkv_age')">KNKV</th>
                    <th @click="sortMembersTable('age')">Leeftijd</th>
                </tr>
                </thead>
                <tr
                        v-for="(member, index) in sortedList"
                        :key="index"
                        v-if="member.knkv_age <= 19"
                        class="member"
                        :class="{'knkv-different': member.age !== member.knkv_age}"
                >
                    <td class="name" nowrap>
                        <span class="firstname">{{member.firstname}}</span>
                      <span v-if="member.middlename != ''"> {{member.middlename}}</span>
                        <span class="lastname"> {{member.lastname}}</span>
                    </td>
                    <td class="limit-team">{{member.limit_team}}</td>
                    <td class="knkv-age">{{member.knkv_age}}</td>
                    <td class="age">{{member.age}}</td>
                </tr>
            </table>
        </div>
    </main>
</template>

<script>
    /* eslint-disable no-console */
    import moment from "moment";
    import PlayerAPI from '@/api/Player'
    import DivisionAPI from '@/api/Division'

    const now = moment();
    const august = 8;

    export default {
        name: "indexComponent",
        props: {
            msg: String
        },
        data() {
            return {
                search: "",
                members: [],
                divisions: [],
                currentSort: "knkv_age",
                currentSortDir: "desc",
                checkdate: this.getCheckDate(),
                nextCheckDate: false
            };
        },
        mounted() {
            this.divisions = DivisionAPI.getAllDivisions();
            this.members = PlayerAPI.getAllPlayers();
        },
        methods: {
            getCheckDate() {
                let date = moment().dayOfYear(1);
                if (now.format("M") >= august) {
                    date = date.set("year", now.year() + 1);
                }
                return date;
            },
            useNextCheckDate() {
                let date = this.checkdate;
                this.checkdate = date.set("year", now.year() + 1);
                this.useNextCheckDate = true;
                this.filterMembersList();
            },
            sortMembersTable(s) {
                //if s == current sortMembersTable, reverse
                if (s === this.currentSort) {
                    this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
                }
                this.currentSort = s;
            },
            filterMembersList() {
                return this.members.filter(person => {
                    if (this.useNextCheckDate == true) {
                        person.original_knkv_age =
                            moment(this.checkdate).diff(person.date_of_birth, "years") - 1;
                        if (person.hasOwnProperty("knkv_changed") == false) {
                            person.knkv_age = person.original_knkv_age + 1;
                            this.divisions.forEach(function (division) {
                                if (
                                    person.knkv_age <= division.max_age &&
                                    person.knkv_age >= division.min_age
                                ) {
                                    person.limit_team = division.name;
                                }
                            });
                        }
                        person.knkv_changed = true;
                    }
                    return person.fullname.toLowerCase().includes(this.search.toLowerCase());
                });
            }
        },
        computed: {
          sortedList() {
                let members = this.filterMembersList();
                return members.sort((a, b) => {
                    let modifier = 1;
                    if (this.currentSortDir === "desc") modifier = -1;
                    if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                    if (a[this.currentSort] > b[this.currentSort]) return modifier;
                    return 0;
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin: 2px 10px;
    }

    a {
        color: #42b983;
    }

    .description {
        display: block;
        margin: 10px 0;
        font-weight: bold;
        font-size: 1.2em;
    }

    .members-table-container {
        max-width: 720px;
        text-align: initial;
        margin: 20px auto 0 auto;
    }

    .members-table {
        th {
            text-align: left;
            padding: 0 4px;
        }

        td {
            padding: 0 4px;
        }

        .name {
            .firstname,
            .lastname {
                display: inline;
            }
        }
    }

    .divisions {
        max-width: 720px;
        text-align: left;
        margin: 0 auto;
    }

    .search-wrapper {
        input {
            height: 30px;
            outline: none;
            padding: 0 80px 0 20px;
            border-radius: 30px;
            background: #6897cd;
            color: white;
            border: 2px solid #24557f;
            text-shadow: 0 0 10px #6897cd;
            margin-top: 5px;

            &::placeholder {
                color: #4a4a4a;
            }

            &:focus-within {
                background: #7fc0ff;
                color: black;
                border: 2px solid #4d6bd7;
                text-shadow: 0 0 10px #7fc0ff;
            }
        }
    }

    .member {
        line-height: 1.5em;

        &.knkv-different {
            .knkv-age {
                color: orangered;
                font-weight: bold;
            }
        }
    }

    .nextCheck-btn {
        display: block;
        text-align: center;
        margin: 0 auto;
    }
</style>
