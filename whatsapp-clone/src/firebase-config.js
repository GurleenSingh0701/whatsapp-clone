import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCabGrGGOzuxFuVArEiDYjcdgZbY8r8B58",

  authDomain: "whatsapp-mern-f0daa.firebaseapp.com",

  projectId: "whatsapp-mern-f0daa",

  storageBucket: "whatsapp-mern-f0daa.appspot.com",

  messagingSenderId: "40345497967",

  appId: "1:40345497967:web:b288fb7bc8a33da80fb89a",

  measurementId: "G-7L35ZK7KVJ",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider,db};
export default firebase;