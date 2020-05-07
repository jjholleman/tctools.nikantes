/* eslint-disable no-console */
import DivisionAPI from '@/api/Division'
import moment from 'moment'
import {db} from './../firebase'

export default {
    data: {
        players: [],
    },
    firestore() {
        return {
            players: db.collection('players')
        }
    },
    get(nextSeason) {
        this.firestore().players.orderBy('date_of_birth', "desc").onSnapshot({includeMetadataChanges: true}, querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                let player = change.doc.data();
                player = this.generateAdditionalPlayerData(player, nextSeason);
                this.data.players.push(player);
            });
        });
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
        let date = moment().dayOfYear(1);
        if (moment().format("M") >= 7) { //7 = August. Moment starts months from 0
            date = date.set("year", moment().year() + 1);
        }
        if (useNextSeason === true) {
            date = date.set("year", moment().year() + 1);
        }
        return date
    },
}
