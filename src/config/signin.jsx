import {
    setPersistence,
    onAuthStateChanged,
    signInWithPopup,
    signInWithCredential,
    signOut,
    GoogleAuthProvider,
    browserLocalPersistence
} from "firebase/auth";

import { auth } from './firebase';
import { provider } from './firebase';

import { collection, setDoc, addDoc, doc } from "firebase/firestore";
import { db, rtdb } from '../config/firebase';
import {ref, set, get, child, ref as dbRef} from 'firebase/database';

// import { redirect } from "react-router-dom";

const signInWithGoogleHandler = async (event) => {
    event.preventDefault();
    try {
        const response = await setPersistence(auth, browserLocalPersistence)
            .then(() => signInWithPopup(auth, provider))
        // console.log(response)
        // console.log(response.user.uid)

        const createdAt = response.user.metadata.createdAt;
        const lastLoginAt = response.user.metadata.lastLoginAt;
        // console.log(createdAt)
        // console.log(lastLoginAt)


        // console.log(ref)
        const rtdbRef = ref(rtdb, '/users/' + `${response.user.uid}`);
        const snapshot = await get(rtdbRef);
        if (snapshot.exists()) {
            // console.log('Old user, rtdb')
            // console.log(snapshot.val());
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
            // console.log(res);
        }

        const credential = GoogleAuthProvider.credentialFromResult(response);
        const token = credential.accessToken
        localStorage.setItem('token', token);
        localStorage.setItem('uid', response.user.uid);
        // redirect('/editor/' + response.user.uid)
    } catch (err) {
        // console.log('SignInError', err)
    }
}

export default signInWithGoogleHandler;