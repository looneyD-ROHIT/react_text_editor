import {
    GoogleAuthProvider,
    browserLocalPersistence,
    setPersistence,
    signInWithPopup
} from "firebase/auth";

import { auth, provider } from './firebase';

import { get, ref, set } from 'firebase/database';
import { addDoc, collection } from "firebase/firestore";
import { db, rtdb } from '../config/firebase';


const signInWithGoogleHandler = async (event) => {
    event.preventDefault();
    try {
        const response = await setPersistence(auth, browserLocalPersistence)
            .then(() => signInWithPopup(auth, provider))

        const createdAt = response.user.metadata.createdAt;
        const lastLoginAt = response.user.metadata.lastLoginAt;


        const rtdbRef = ref(rtdb, '/users/' + `${response.user.uid}`);
        const snapshot = await get(rtdbRef);
        if (snapshot.exists()) {
            // console.log('Old user, rtdb')
        } else {
            // console.log('New user, rtdb')
            // add user existence to rtdb
            await set(ref(rtdb, 'users/' + `${response.user.uid}`), {
                name: response.user.displayName,
                email: response.user.email,
                profile_picture: response.user.photoURL
            });

            const rtdbRefCount = ref(rtdb, '/totalCount/');
            const snapshotCount = await get(rtdbRefCount);
            await set(rtdbRefCount, {
                totalUsers: snapshotCount.val().totalUsers ? snapshotCount.val().totalUsers + 1 : 1,
                totalWords: snapshotCount.val().totalWords,
                totalCharacters: snapshotCount.val().totalCharacters
            });

            // add initial file for user in firestore
            const collRef = collection(db, 'users', response.user.uid, 'files');
            const t = Date.now();
            const res = await addDoc(collRef, {
                'createdAt': t,
                'lastOpened': t,
                'fileName': 'Untitled-1.txt',
                'fileData': ''
            })
        }

        const credential = GoogleAuthProvider.credentialFromResult(response);
        const token = credential.accessToken
        localStorage.setItem('token', token);
        localStorage.setItem('uid', response.user.uid);
    } catch (err) {
        // console.log('SignInError', err)
    }
}

export default signInWithGoogleHandler;