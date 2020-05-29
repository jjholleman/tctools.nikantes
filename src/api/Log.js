import {db} from './../firebase'
import * as firebase from "firebase/app";

let logRef = db.collection('logs');

export default {
    deletePlayer(player) {
        logRef.add({
            action: "DELETE",
            source: {
                type: "document",
                collection: "players",
                ref: player[".key"],
            },
            data: {
                delete: player,
            },
            created_at: firebase.firestore.Timestamp.fromDate(new Date()),
            userAgent: navigator.userAgent
        }).then(() => {})
    },
    updatePlayer(originalPlayer, newPlayer) {
        logRef.add({
            action: "UPDATE",
            source: {
                type: "document",
                collection: "players",
                ref: originalPlayer[".key"],
            },
            data: {
                old: originalPlayer,
                patch: newPlayer,
            },
            created_at: firebase.firestore.Timestamp.fromDate(new Date()),
            userAgent: navigator.userAgent
        }).then(() => {})
    },
    createPlayer(player, id) {
        logRef.add({
            action: "CREATE",
            source: {
                type: "document",
                collection: "players",
                ref: id,
            },
            data: {
                new: player,
            },
            created_at: firebase.firestore.Timestamp.fromDate(new Date()),
            userAgent: navigator.userAgent
        }).then(() => {})
    }
}
