import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'

var firebaseConfig = {
	apiKey: "AIzaSyCgvd1aR4N02YrajlL_VxI_mAFgX2YQomY",
	authDomain: "ride4life-468c8.firebaseapp.com",
	databaseURL: "https://ride4life-468c8.firebaseio.com",
	projectId: "ride4life-468c8",
	storageBucket: "ride4life-468c8.appspot.com",
	messagingSenderId: "195636163295",
	appId: "1:195636163295:web:c71268a3d07de7b7"
};

firebase.initializeApp(firebaseConfig)

window.firebase = firebase;
//
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = ()=> auth.signInWithPopup(provider)
export const signOut = ()=> auth.signOut()
console.log(signInWithGoogle)
firestore.settings( { timestampsInSnapshots: true});


export default firebase;
