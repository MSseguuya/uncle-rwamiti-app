import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp({
        apiKey: firebaseConfigJson.apiKey,
        authDomain: firebaseConfigJson.authDomain,
        projectId: firebaseConfigJson.projectId,
        storageBucket: firebaseConfigJson.storageBucket,
        messagingSenderId: firebaseConfigJson.messagingSenderId,
        appId: firebaseConfigJson.appId,
      });
    }
  }
  return appInstance;
}

export function getDb(): Firestore {
  if (!dbInstance) {
    const app = getFirebaseApp();
    // Use the provisioned databaseId from firebase-applet-config.json if available
    const databaseId = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
      ? firebaseConfigJson.firestoreDatabaseId
      : undefined;

    if (databaseId) {
      dbInstance = getFirestore(app, databaseId);
    } else {
      dbInstance = getFirestore(app);
    }
  }
  return dbInstance;
}
