import {db} from './../firebase'
import * as firebase from "firebase/app";

let logRef = db.collection('logs');
let ip = fetch('https://api6.ipify.org?format=json')
    .then(x => x.json())
    .then(({ip}) => {
        return ip;
    });

export default {
    deletePlayer(player) {
        ip.then(ip => {
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
                userAgent: navigator.userAgent,
                ip: ip,
            }).then(() => {
            })
        });
    },
    updatePlayer(originalPlayer, newPlayer) {
        ip.then(ip => {
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
                userAgent: navigator.userAgent,
                ip: ip,
            }).then(() => {
            })
        });
    },
    createPlayer(player, id) {
        ip.then(ip => {
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
                userAgent: navigator.userAgent,
                ip: ip,
            }).then(() => {
            })
        });
    },
    login() {
        ip.then(ip => {
            logRef.add({
                action: "LOGIN",
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
                userAgent: navigator.userAgent,
                ip: ip,
            }).then(() => {
            })
        });
    },
    createTeam(team, id) {
        ip.then(ip => {
            logRef.add({
                action: "CREATE",
                source: {
                    type: "document",
                    collection: "teams",
                    ref: id,
                },
                data: {
                    new: team,
                },
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
                userAgent: navigator.userAgent,
                ip: ip,
            }).then(() => {
            })
        });
    },
}
