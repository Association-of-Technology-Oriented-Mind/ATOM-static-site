import { useQuery } from '@tanstack/react-query';
import { getClubs, getCoordinators, getEvents, getGalleryImages } from '@/utils/dataService';

// Content changes rarely; keep it cached for the session rather than refetching
// on every mount and remount of the events pages.
const STALE_TIME = 5 * 60 * 1000;

export const useEvents = () =>
  useQuery({ queryKey: ['events'], queryFn: getEvents, staleTime: STALE_TIME });

export const useCoordinators = () =>
  useQuery({ queryKey: ['coordinators'], queryFn: getCoordinators, staleTime: STALE_TIME });

export const useClubs = () =>
  useQuery({ queryKey: ['clubs'], queryFn: getClubs, staleTime: STALE_TIME });

export const useGalleryImages = () =>
  useQuery({ queryKey: ['gallery'], queryFn: getGalleryImages, staleTime: STALE_TIME });
