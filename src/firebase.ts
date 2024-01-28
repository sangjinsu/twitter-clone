import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import config from "../config.json"

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const storage = getStorage(app)

export const db = getFirestore(app)