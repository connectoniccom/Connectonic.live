
import * as admin from 'firebase-admin';

// This is a server-side only file.
// It is used by the API routes to interact with Firebase services on the backend.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;
  
function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.apps[0] as admin.app.App;
    }

    const credential = serviceAccount 
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault();

    return admin.initializeApp({
        credential,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

export const getAdminApp = () => initializeAdminApp();
