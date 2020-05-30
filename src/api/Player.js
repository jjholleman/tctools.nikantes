/* eslint-disable no-console */
import DivisionAPI from '@/api/Division'
import moment from 'moment'
import {db} from './../firebase'

export default {
    data: {
        players: [],
        player: {},
    },
    firestore() {
        return {
            players: db.collection('players')
        }
    },
    getAll(nextSeason, update) {
        return this.data.players.length === 0 || update === true ? this.setAll(nextSeason) : this.data.players;
    },
    setAll(nextSeason) {
        let collection = [];
        this.firestore().players.orderBy('date_of_birth', "desc").onSnapshot({includeMetadataChanges: true}, querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                let player = change.doc.data();
                player.id = change.doc.id;
                player = this.generateAdditionalPlayerData(player, nextSeason);
                collection.push(player)
            });
        });
        this.data.players = collection;
        return this.data.players
    },
    generateAdditionalPlayerData(player, nextSeason) {
        player = this.getPlayerKNKVAge(player, this.getCheckDate(nextSeason));
        player.fullname = [player.firstname, player.middlename, player.lastname].join(" ");
        return player;
    },
    getPlayerKNKVAge(player, checkDate) {
        // Get the persons age and age on the checkDate
        let date_of_birth = moment(player.date_of_birth.toDate());
        player.age = moment().diff(date_of_birth, "years");
        player.knkv_age = moment(checkDate).diff(date_of_birth, 'years');

        // Calculate the lowest accepted team the person can play in, based on the divisions data
        DivisionAPI.getAllDivisions().forEach(function (division) {
            if (
                player.knkv_age <= division.max_age &&
                player.knkv_age >= division.min_age
            ) {
                player.limit_team = division.name;
            }

        });
        return player;
    },
    getCheckDate(useNextSeason) {
        let date = moment();
        if (date.month() >= 7) { //7 = August. Moment starts months from 0
            date = date.endOf('year')
        } else {
            date = date.year(date.year()-1).endOf('year')
        }
        if (useNextSeason === true) {
            date = date.set("year", date.year()+1);
        }
        return date
    },
}
