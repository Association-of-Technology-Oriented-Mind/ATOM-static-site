#!/usr/bin/env node
/**
 * Grants the `admin` custom claim required by firestore.rules.
 *
 *   node scripts/set-admin-claim.mjs atom@karunya.edu.in
 *
 * Needs firebase-admin (npm i -D firebase-admin) and a service account key at
 * ./serviceAccount.json (Project settings → Service accounts → Generate new
 * private key). That file is gitignored — it is a real secret.
 *
 * The user must sign out and back in afterwards; claims only land on a
 * freshly issued ID token.
 */
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/set-admin-claim.mjs <email>');
  process.exit(1);
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? './serviceAccount.json';

let credential;
try {
  credential = cert(JSON.parse(readFileSync(keyPath, 'utf8')));
} catch {
  console.error(`Could not read a service account key at ${keyPath}.`);
  console.error('Firebase Console → Project settings → Service accounts → Generate new private key');
  process.exit(1);
}

initializeApp({ credential });

const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, { admin: true });

const updated = await getAuth().getUser(user.uid);
console.log(`admin claim set for ${email} (uid ${user.uid})`);
console.log('claims:', updated.customClaims);
console.log('\nSign out and back in for the new token to take effect.');
