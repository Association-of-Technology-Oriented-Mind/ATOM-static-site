#!/usr/bin/env node
/**
 * One-time seed: copies the bundled content in src/constants into Firestore.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json \
 *   node scripts/seed-firestore.mjs
 *
 * Safe to re-run: documents are keyed by id, so it upserts rather than
 * duplicating. Requires firebase-admin (npm i -D firebase-admin) and a service
 * account key from Firebase Console → Project settings → Service accounts.
 */
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.');
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, 'utf8'))) });
const db = getFirestore();

// Events are plain data, so they can be parsed straight out of the TS source.
// Coordinators and clubs import image binaries, so they are seeded from the
// admin UI instead of here.
const source = readFileSync(new URL('../src/constants/events.ts', import.meta.url), 'utf8');
const arrayBody = source.slice(source.indexOf('export const events'));
const literal = arrayBody.slice(arrayBody.indexOf('['), arrayBody.lastIndexOf('];') + 1);

const events = eval(literal);

const batch = db.batch();
for (const event of events) {
  batch.set(db.collection('events').doc(String(event.id)), event);
}
await batch.commit();

console.log(`Seeded ${events.length} events into Firestore.`);
