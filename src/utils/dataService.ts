import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { events as defaultEvents, type Event } from '@/constants/events';
import { coordinators as defaultCoordinators } from '@/constants/coordinators';
import { clubs as defaultClubs } from '@/constants/clubs';
import { galleryImages as defaultGalleryImages } from '@/constants/gallery';
import { COLLECTIONS, db, isFirebaseConfigured } from '@/lib/firebase';
import { eventSchema } from '@/lib/schemas';

// Firestore is the source of truth once configured. The bundled constants stay
// as the fallback so the public site still renders on a fresh clone with no
// .env, and so a Firestore outage degrades to stale content rather than a blank
// page.

const fetchCollection = async <T>(name: string, fallback: T[]): Promise<T[]> => {
  if (!isFirebaseConfigured || !db) return fallback;

  try {
    const snapshot = await getDocs(collection(db, name));
    if (snapshot.empty) return fallback;
    return snapshot.docs.map(document => document.data() as T);
  } catch (error) {
    console.error(`Failed to load "${name}" from Firestore; using bundled defaults.`, error);
    return fallback;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  if (!isFirebaseConfigured || !db) return defaultEvents;

  try {
    const snapshot = await getDocs(query(collection(db, COLLECTIONS.events), orderBy('date', 'desc')));
    if (snapshot.empty) return defaultEvents;

    // Drop malformed documents rather than letting them crash the events page.
    return snapshot.docs.flatMap(document => {
      const parsed = eventSchema.safeParse(document.data());
      if (!parsed.success) {
        console.error(`Skipping invalid event document "${document.id}"`, parsed.error.issues);
        return [];
      }
      return [parsed.data as Event];
    });
  } catch (error) {
    console.error('Failed to load events from Firestore; using bundled defaults.', error);
    return defaultEvents;
  }
};

export const getCoordinators = () =>
  fetchCollection<(typeof defaultCoordinators)[number]>(COLLECTIONS.coordinators, defaultCoordinators);

export const getClubs = () =>
  fetchCollection<(typeof defaultClubs)[number]>(COLLECTIONS.clubs, defaultClubs);

/**
 * Bundled photos plus anything uploaded through the CMS.
 *
 * The 133 bundled images are build-time imports served from the Hosting CDN,
 * so they stay in the list rather than being replaced by Firestore — otherwise
 * a single CMS upload would hide the entire existing gallery.
 */
export const getGalleryImages = async (): Promise<string[]> => {
  if (!isFirebaseConfigured || !db) return defaultGalleryImages;

  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.gallery));
    const uploaded = snapshot.docs.map(document => (document.data() as { url: string }).url);
    // Uploaded photos are the newest, so they lead.
    return [...uploaded, ...defaultGalleryImages.filter(url => !uploaded.includes(url))];
  } catch (error) {
    console.error('Failed to load gallery from Firestore; using bundled defaults.', error);
    return defaultGalleryImages;
  }
};

export const saveEvent = async (event: Event): Promise<void> => {
  if (!db) throw new Error('Firestore is not configured.');
  await setDoc(doc(db, COLLECTIONS.events, String(event.id)), eventSchema.parse(event));
};

export const deleteEvent = async (id: number): Promise<void> => {
  if (!db) throw new Error('Firestore is not configured.');
  await deleteDoc(doc(db, COLLECTIONS.events, String(id)));
};

export const saveGalleryImage = async (url: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not configured.');
  await setDoc(doc(collection(db, COLLECTIONS.gallery)), { url, createdAt: Date.now() });
};

/**
 * Replaces a whole collection with `items`, keyed by `idKey`.
 * The admin managers edit in-memory arrays and save the result wholesale, so
 * documents removed from the array are deleted from Firestore too.
 */
export const replaceCollection = async <T extends object>(
  name: string,
  items: T[],
  idKey: keyof T,
): Promise<void> => {
  if (!db) throw new Error('Firestore is not configured.');
  const firestore = db;

  const existing = await getDocs(collection(firestore, name));
  const nextIds = new Set(items.map(item => String(item[idKey])));

  await Promise.all([
    ...existing.docs
      .filter(document => !nextIds.has(document.id))
      .map(document => deleteDoc(document.ref)),
    ...items.map(item =>
      setDoc(doc(firestore, name, String(item[idKey])), item as Record<string, unknown>),
    ),
  ]);
};

export const filterUpcoming = (events: Event[]) => events.filter(event => event.status === 'upcoming');
export const filterPast = (events: Event[]) => events.filter(event => event.status === 'past');
export const eventCategories = (events: Event[]) => Array.from(new Set(events.map(event => event.category)));
export const eventYears = (events: Event[]) =>
  Array.from(new Set(events.map(event => new Date(event.date).getFullYear().toString())));
