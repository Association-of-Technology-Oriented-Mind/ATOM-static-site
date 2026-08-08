import deepakumar from '@/assets/Deepakumar.webp';
import thirupathi from '@/assets/Thirupathi S.webp';

// Core team for the current academic year.
//
// Positions are fixed and paired: each portfolio has a lead and a joint holder.
// The site renders one full-viewport panel per pair, in this order, so the
// array order is the display order — not a detail to shuffle casually.
//
// People change every year; the roles do not. Fill `name`, `image`, `bio` and
// `linkedin` as members are confirmed. Blank entries render as an open seat
// rather than breaking the layout.

export interface Coordinator {
  id: number;
  /** Empty string means the seat is not yet filled. */
  name: string;
  role: string;
  /** Imported image, or null to fall back to the initials placeholder. */
  image: string | null;
  bio: string;
  linkedin: string;
  /** Groups a lead with their joint holder into one panel. */
  portfolio: string;
  /** True for the lead of each pair; false for the joint holder. */
  isLead: boolean;
}

export const portfolios = [
  'Secretariat',
  'Treasury',
  'Technical Events',
  'Event Management',
  'Media',
  'Spiritual',
] as const;

export type Portfolio = (typeof portfolios)[number];

const seat = (
  id: number,
  role: string,
  portfolio: Portfolio,
  isLead: boolean,
): Coordinator => ({
  id,
  name: '',
  role,
  image: null,
  bio: '',
  linkedin: '',
  portfolio,
  isLead,
});

export const coordinators: Coordinator[] = [
  {
    ...seat(1, 'Secretary', 'Secretariat', true),
    name: 'Deepakumar S',
    image: deepakumar,
    bio: 'Skilled in offensive security. Awarded Best Idea at the TN Police Hackathon and secured a summer internship offer through Cyberthon 2025.',
    linkedin: 'linkedin.com/in/deepakumar-s',
  },
  seat(2, 'Joint Secretary', 'Secretariat', false),
  {
    ...seat(3, 'Treasurer', 'Treasury', true),
    name: 'Thirupathi S',
    image: thirupathi,
    bio: 'Focused on building practical tools and keeping the club’s accounts straight. Active across ATOM’s technical events.',
    linkedin: 'linkedin.com/in/thirupathi-s',
  },
  seat(4, 'Joint Treasurer', 'Treasury', false),
  seat(5, 'Technical Event Coordinator', 'Technical Events', true),
  seat(6, 'Joint Technical Event Coordinator', 'Technical Events', false),
  seat(7, 'Event Management Coordinator', 'Event Management', true),
  seat(8, 'Joint Event Management Coordinator', 'Event Management', false),
  seat(9, 'Media Coordinator', 'Media', true),
  seat(10, 'Joint Media Coordinator', 'Media', false),
  seat(11, 'Spiritual Coordinator', 'Spiritual', true),
  seat(12, 'Joint Spiritual Coordinator', 'Spiritual', false),
];

/** Coordinators grouped into their display panels, preserving order. */
export const coordinatorsByPortfolio = portfolios.map(portfolio => ({
  portfolio,
  members: coordinators.filter(c => c.portfolio === portfolio),
}));
