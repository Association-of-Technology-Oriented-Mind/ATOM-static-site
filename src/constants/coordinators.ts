import deepakumar from '@/assets/Deepakumar.webp';
import thirupathi from '@/assets/Thirupathi S.jpg';
import lebi from '@/assets/Lebi.jpg';
import nithishkumar from '@/assets/NithishkumarS.jpg';
import sanjay from '@/assets/SanjayS.png';
import shohil from '@/assets/Shohil.jpg';
import mallika from '@/assets/Mallika.jpg';
import nithishk from '@/assets/NithishK.jpg';
import sona from '@/assets/Sona.jpg';
import jemimah from '@/assets/Jemimah.png';
import evans from '@/assets/EVANS T.jpeg';

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
  {
    ...seat(2, 'Joint Secretary', 'Secretariat', false),
    name: 'Lebi Raja C',
    image: lebi,
    bio: 'Skilled in Generative AI and software development. Winner of Makers Day 2026, Meta × PyTorch Hackathon finalist, and BI3 Bytes Hackathon runner-up.',
    linkedin: 'linkedin.com/in/lebiraja',
  },
  {
    ...seat(3, 'Treasurer', 'Treasury', true),
    name: 'Thirupathi S',
    image: thirupathi,
    bio: 'Focused on building practical tools and keeping the club’s accounts straight. Active across ATOM’s technical events.',
    linkedin: 'linkedin.com/in/thirupathi-s',
  },
  {
    ...seat(4, 'Joint Treasurer', 'Treasury', false),
    name: 'Nithishkumar S',
    image: nithishkumar,
    bio: 'Skilled in Artificial Intelligence and Data Science, with hands-on experience as a Data Science Intern at Codec Technologies.',
    linkedin: 'linkedin.com/in/nithishkumar-sakthivel-49a7ba365',
  },
  {
    ...seat(5, 'Technical Event Coordinator', 'Technical Events', true),
    name: 'Sanjay S',
    image: sanjay,
    bio: 'Skilled in Cybersecurity, awarded Best Idea at the TN Police Hackathon 2025, and co-founded Torkq, an LLM gateway for PII/PCI redaction and compliance.',
    linkedin: 'linkedin.com/in/sanjay-s-699585345',
  },
  {
    ...seat(6, 'Joint Technical Event Coordinator', 'Technical Events', false),
    name: 'KP Shohil',
    image: shohil,
    bio: 'Skilled in AI/ML and Data Science, with ML and Data Analytics internship experience and a 1st-place win at Makers Day.',
    linkedin: 'linkedin.com/in/kp-shohil',
  },
  {
    ...seat(7, 'Event Management Coordinator', 'Event Management', true),
    name: 'Regulla Mallika Priyaharshini',
    image: mallika,
    bio: 'Skilled in AI, Deep Learning, and Machine Learning, with hands-on internship experience and active involvement in technical and organizational initiatives.',
    linkedin: 'linkedin.com/in/mallika-regulla-059232297',
  },
  {
    ...seat(8, 'Joint Event Management Coordinator', 'Event Management', false),
    name: 'Nithishkumar K',
    image: nithishk,
    bio: 'Cybersecurity specialist protecting networks and data',
    linkedin: 'linkedin.com/in/nithishkumar-k-691473351',
  },
  seat(9, 'Media Coordinator', 'Media', true),
  {
    ...seat(10, 'Joint Media Coordinator', 'Media', false),
    name: 'Sona Santhosh',
    image: sona,
    bio: 'Skilled in Data Analytics with hands-on experience in Python, SQL, and data visualization, and serves as Head of the NSS Media Team with strong creative and event coordination skills.',
    linkedin: 'linkedin.com/in/sona-santhosh-urk24ai1040',
  },
  {
    ...seat(11, 'Spiritual Coordinator', 'Spiritual', true),
    name: 'Jemimah Praisy P',
    image: jemimah,
    bio: 'Academic rank holder skilled in AI, Full-Stack Development, and Data Science, with AWS and Microsoft Azure AI certifications and experience as a Software Engineering Intern.',
    linkedin: 'linkedin.com/in/jemimahpraisy7',
  },
  {
    ...seat(12, 'Joint Spiritual Coordinator', 'Spiritual', false),
    name: 'Evans T',
    image: evans,
    bio: 'Skilled in Artificial Intelligence and Full-Stack Development. Institutional Merit Scholarship holder, SIPCOT Hackathon runner-up, and zonal football gold medalist who actively volunteers in community and spiritual service.',
    linkedin: '',
  },
];

/** Coordinators grouped into their display panels, preserving order. */
export const coordinatorsByPortfolio = portfolios.map(portfolio => ({
  portfolio,
  members: coordinators.filter(c => c.portfolio === portfolio),
}));
