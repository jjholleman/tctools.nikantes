/* eslint-disable no-console */
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
        let dobRaw = player.date_of_birth;
        let date_of_birth;

        if (dobRaw && typeof dobRaw.toDate === 'function') {
            date_of_birth = moment(dobRaw.toDate());
        } else if (dobRaw && dobRaw.seconds) {
            date_of_birth = moment(new Date(dobRaw.seconds * 1000));
        } else {
            console.warn('Invalid date_of_birth:', dobRaw);
            return player;
        }

        player.age = moment().diff(date_of_birth, "years", true);
        player.knkv_age = moment(checkDate).diff(date_of_birth, 'years', true);
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
