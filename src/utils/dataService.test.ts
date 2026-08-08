import { beforeEach, describe, expect, it, vi } from 'vitest';

const getDocs = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (_db: unknown, name: string) => ({ name }),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDocs: (...args: unknown[]) => getDocs(...args),
  orderBy: vi.fn(),
  query: (ref: unknown) => ref,
  setDoc: vi.fn(),
}));

vi.mock('@/lib/firebase', () => ({
  db: {},
  isFirebaseConfigured: true,
  COLLECTIONS: {
    events: 'events',
    coordinators: 'coordinators',
    clubs: 'clubs',
    gallery: 'gallery',
    registrations: 'registrations',
  },
}));

const { getEvents } = await import('./dataService');
const { events: defaultEvents } = await import('@/constants/events');

const asSnapshot = (docs: unknown[]) => ({
  empty: docs.length === 0,
  docs: docs.map((data, index) => ({ id: `doc-${index}`, data: () => data })),
});

const validEvent = {
  id: 99,
  title: 'Firestore Event',
  date: '2025-11-01',
  location: 'Main Hall',
  description: 'Loaded from Firestore.',
  image: '/EVENTS/x.webp',
  status: 'past',
  category: 'Workshop',
  eventType: 'free',
};

describe('getEvents', () => {
  beforeEach(() => {
    getDocs.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns events from Firestore when present', async () => {
    getDocs.mockResolvedValue(asSnapshot([validEvent]));

    const events = await getEvents();

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Firestore Event');
  });

  it('falls back to bundled defaults when the collection is empty', async () => {
    getDocs.mockResolvedValue(asSnapshot([]));

    const events = await getEvents();

    expect(events).toEqual(defaultEvents);
  });

  it('falls back to bundled defaults when Firestore throws', async () => {
    // A Firestore outage should degrade to stale content, not a blank page.
    getDocs.mockRejectedValue(new Error('unavailable'));

    const events = await getEvents();

    expect(events).toEqual(defaultEvents);
  });

  it('skips malformed documents instead of failing the whole page', async () => {
    getDocs.mockResolvedValue(asSnapshot([validEvent, { id: 100, title: 'Broken' }]));

    const events = await getEvents();

    expect(events).toHaveLength(1);
    expect(events[0].id).toBe(99);
  });
});
