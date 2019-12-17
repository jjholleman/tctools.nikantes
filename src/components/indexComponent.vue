<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <main>
        <div class="search-wrapper">
            <label>
                <input type="text" v-model="search" placeholder="Zoek speler..."/>
                <div class="search"></div>
            </label>
        </div>
        <span class="description">Het team waaronder een speler vermeldt staat is het LAAGSTE team waar het voor mag uitkomen.</span>
        <span class="peildatum">Peildatum {{getCheckDate().format("DD-MM-YYYY")}}</span>

        <div class="members-table-container">
            <table class="members-table">
                <thead><tr>
                    <th @click="sortMembersTable('firstname')">Naam</th>
                    <th @click="sortMembersTable('limit_team')">Team</th>
                    <th @click="sortMembersTable('knkv_age')">KNKV</th>
                    <th @click="sortMembersTable('age')">Leeftijd</th>
                </tr></thead>
                <tr v-for="member in sortedList" v-bind:key="member.name" v-if="member.knkv_age <= 19" class="member" :class="{'knkv-different': member.age !== member.knkv_age}">
                    <td class="name" nowrap><span class="firstname">{{member.firstname}}</span> <span class="lastname">{{member.lastname}}</span></td>
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

    import csv from 'csvtojson';
    import moment from 'moment';

    const request = require('request');
    const now = moment();
    const august = 8;

    export default {
        name: 'indexComponent',
        props: {
            msg: String
        },
        data() {
            return {
                search: '',
                members: [],
                divisions: [
                    {
                        'name': 'Senioren',
                        'max_age': 9999,
                        'min_age': 19
                    },
                    {
                        'name': 'A',
                        'max_age': 19,
                        'min_age': 16
                    },
                    {
                        'name': 'B',
                        'max_age': 16,
                        'min_age': 14
                    },
                    {
                        'name': 'C',
                        'max_age': 14,
                        'min_age': 12
                    },
                    {
                        'name': 'D',
                        'max_age': 12,
                        'min_age': 10
                    },
                    {
                        'name': 'E',
                        'max_age': 10,
                        'min_age': 8
                    },
                    {
                        'name': 'F',
                        'max_age': 8,
                        'min_age': 0
                    },
                ],
                currentSort: 'knkv_age',
                currentSortDir: 'desc',
            }
        },
        mounted() {
            const href = window.location.href;
            const dir = href.substring(0, href.lastIndexOf('/')) + "/";
            let divisions = this.divisions;
            csv().fromStream(request.get(dir + '/nikantesleden')).then((jsonObj) => {
                let checkdate = this.getCheckDate();

                jsonObj.forEach(function (person) {
                    Object.keys(person).forEach(function (key) {
                        let keyname = key.toLowerCase();
                        if (keyname.includes("naam")) {
                            person["name"] = person[key];
                            let nameParts = person.name.split(/[,]+/);
                            person.firstname = nameParts[nameParts.length - 1];
                            person.lastname = nameParts[0];
                            delete person[key];
                        } else if (keyname.includes("geboortedatum")) {
                            person["date_of_birth"] = person[key];
                            delete person[key];
                        } else {
                            delete person[key]
                        }
                    });

                    // Get the persons age and age on the checkdate
                    person.age = moment().diff(person.date_of_birth, 'years');
                    person.knkv_age = moment(checkdate).diff(person.date_of_birth, 'years');

                    // Calculate the lowest accepted team the person can play in, based on the divisions data
                    divisions.forEach(function(division) {
                        if (person.knkv_age <= division.max_age && person.knkv_age >= division.min_age) {
                            person.limit_team = division.name
                        }
                    });
                });

                this.members = jsonObj;
            })
        },
        methods: {
            getCheckDate() {
                let date = moment().dayOfYear(1);
                if (now.format("M") >= august) {
                    date = date.set('year', now.year() + 1)
                }
                return date
            },
            sortMembersTable(s) {
                //if s == current sortMembersTable, reverse
                if(s === this.currentSort) {
                    this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
                }
                this.currentSort = s;
            },
            filterMembersList() {
                return this.members.filter(person => {
                    return person.name.toLowerCase().includes(this.search.toLowerCase())
                })
            },
        },
        computed: {
            sortedList() {
                let members = this.filterMembersList();
                return members.sort((a,b) => {
                    let modifier = 1;
                    if(this.currentSortDir === 'desc') modifier = -1;
                    if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                    if(a[this.currentSort] > b[this.currentSort]) return modifier;
                    return 0;
                });
            }
        }
    }
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
        margin: 30px 0;
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
            .firstname, .lastname {
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
            height: 50px;
            outline: none;
            padding: 0 80px 0 20px;
            border-radius: 30px;
            background: #6897cd;
            color: white;
            border: 2px solid #24557f;
            text-shadow: 0 0 10px #6897cd;

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
            .knkv-age, .age {
                color: orangered;
                font-weight: bold;
            }
        }
    }
</style>
