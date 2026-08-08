import { events as defaultEvents, Event } from '@/constants/events';
import { coordinators as defaultCoordinators } from '@/constants/coordinators';
import { clubs as defaultClubs } from '@/constants/clubs';
import { galleryImages as defaultGalleryImages } from '@/constants/gallery';

const readStored = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  const stored = localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    console.error(`Corrupt localStorage entry for "${key}"; falling back to defaults.`);
    return fallback;
  }
};

export const getEvents = (): Event[] => readStored('cms_events', defaultEvents);

export const getUpcomingEvents = () => getEvents().filter(event => event.status === 'upcoming');
export const getPastEvents = () => getEvents().filter(event => event.status === 'past');
export const getEventCategories = () => Array.from(new Set(getEvents().map(event => event.category)));
export const getEventYears = () => Array.from(new Set(getEvents().map(event => new Date(event.date).getFullYear().toString())));
export const getEventById = (id: number) => getEvents().find(event => event.id === id);

export const getCoordinators = () => readStored('cms_coordinators', defaultCoordinators);

export const getClubs = () => readStored('cms_clubs', defaultClubs);

export const getGalleryImages = (): string[] => readStored('cms_gallery', defaultGalleryImages);
