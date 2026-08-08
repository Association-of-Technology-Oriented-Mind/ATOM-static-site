import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// The site must still render (read-only, from src/constants) when Firebase is
// unconfigured — e.g. a fresh clone with no .env. Callers check this before
// touching db/auth/storage rather than crashing at import time.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
  storageInstance = getStorage(app);
}

export const db = dbInstance;
export const auth = authInstance;
export const storage = storageInstance;

// Storage is optional: the project runs on the Spark plan without a bucket.
// Gallery images ship with the build; the CMS upload tab hides itself rather
// than failing per-file when no bucket is configured.
export const isStorageConfigured = Boolean(
  storageInstance && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
);

export const COLLECTIONS = {
  events: 'events',
  coordinators: 'coordinators',
  clubs: 'clubs',
  gallery: 'gallery',
  registrations: 'registrations',
} as const;
