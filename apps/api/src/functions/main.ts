import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
if (!admin.apps.length) admin.initializeApp();
/**
 * The Cloud Function Auth Trigger that creates a new user record in the database
 * whenever a new user registers
 **/
export const createUser = functions
    .region('europe-west1')
    .auth.user()
    .onCreate((user: admin.auth.UserRecord) => {
        const { uid, displayName, email } = user;
        return admin
            .firestore()
            .collection('users')
            .doc(uid)
            .set({ uid, displayName, email });
    });
/**
 * The Cloud Function Auth Trigger that deletes a the user record in the database
 * whenever a user is deleted
 **/
export const deleteUser = functions
    .region('europe-west1')
    .auth.user()
    .onDelete((user) => {
        return admin.firestore().collection('users').doc(user.uid).delete();
    });
