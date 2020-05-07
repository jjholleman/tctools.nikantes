/* eslint-disable no-console */
import { firebase } from "@firebase/app";
import "@firebase/firestore";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA0mfK6ikcIQxhAT1rQH6yMMLQ93t3J47s",
    authDomain: "nikantes-1306b.firebaseapp.com",
    databaseURL: "https://nikantes-1306b.firebaseio.com",
    projectId: "nikantes-1306b",
    storageBucket: "nikantes-1306b.appspot.com",
    messagingSenderId: "1013950104671",
    appId: "1:1013950104671:web:d81a59c15c07d2b18c07ea",
    measurementId: "G-2NSQQ1QLQE"
});

firebaseApp.firestore().enablePersistence().catch(error => {
    console.log(error)
});

export const db = firebaseApp.firestore();
export const Firebase = firebase;
