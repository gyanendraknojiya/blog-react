// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';


// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyAY9yTx8apu1L98Yt9lAqaMNApNsKA8GLg",
  authDomain: "secrets-279105.firebaseapp.com",
  projectId: "secrets-279105",
  storageBucket: "secrets-279105.appspot.com",
  messagingSenderId: "337832753308",
  appId: "1:337832753308:web:651993950dd12dbff69559"
};
firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth();
export const firestore = firebase.firestore();


export default firebase;

  