import firebase from "firebase";
import { call } from "react-native-reanimated";
import { useCallback } from "react";

class Fire{
    constructor(){
        this.init()
        this.checkAuth()
    }
    init=()=>{
        if(!firebase.apps.length){
            firebase.initializeApp({
                apiKey: "AIzaSyBv_CwlDtjzLUmn8O8moUo18tVkxYYLGcI",
                authDomain: "messenger-fc53d.firebaseapp.com",
                databaseURL: "https://messenger-fc53d.firebaseio.com",
                projectId: "messenger-fc53d",
                storageBucket: "messenger-fc53d.appspot.com",
                messagingSenderId: "994908779380",
                appId: "1:994908779380:web:dac3d62c4fc00232de7221",
                measurementId: "G-CRNRJL5BVR"
            });
        }

    };
    checkAuth = () =>{

        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
        firebase.auth().onAuthStateChanged(user=>{
            if(!user){
                firebase.auth().signInAnonymously();
            }
        });
    };

    send=messages=>{
        messages.forEach(item=>{
            const message = {
                text : item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user:item.user

            };
            this.db.push(message);

        });
    };
    parse = message =>{
        const{user, text, timestamp}= message.val()
        const{key: _id}= message;
        const createdAt= new Date(timestamp);

        return{
            _id,
            createdAt,
            text,
            user

        };

    };

    get= callback => {
        this.db.on("child_added", snapshot=> callback(this.parse(snapshot)));

    };
    off(){
        this.db.off();
    }

    get db(){
        return firebase.database().ref("messages");
    }
    get uid(){
        return(firebase.auth().currentUser || {} ).uid;
    }

}

export default new Fire();