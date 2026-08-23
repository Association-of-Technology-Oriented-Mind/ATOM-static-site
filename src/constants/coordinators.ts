import deepakumar from '@/assets/UNBIAS/Deepakumar.jpg';
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
import sanjaynesan from '@/assets/SANJAY NESAN J.jpg';

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
    bio: 'Co-founder & CEO of Torkq secure AI gateway. Winner of Cyberthon 2025, and creator of custom forensic VOIP interception tools for the Tamil Nadu Police.',
    linkedin: 'linkedin.com/in/deepakumar-s',
  },
  {
    ...seat(2, 'Joint Secretary', 'Secretariat', false),
    name: 'Lebi Raja C',
    image: lebi,
    bio: 'Junior Software Engineer Intern at Fludigo, specializing in Generative AI, DevOps, and System Design. Winner of Makers Day 2026, Meta × PyTorch Hackathon finalist, and creator of the Athena Indic voice cloning platform.',
    linkedin: 'linkedin.com/in/lebiraja',
  },
  {
    ...seat(3, 'Treasurer', 'Treasury', true),
    name: 'Thirupathi S',
    image: thirupathi,
    bio: 'Software Engineer Intern at GMS and National Level Technoverse Hackathon winner. Main developer of DrugTrace, a LangGraph and Neo4j multi-agent AI drug repurposing platform.',
    linkedin: 'linkedin.com/in/thirupathi-s',
  },
  {
    ...seat(4, 'Joint Treasurer', 'Treasury', false),
    name: 'Nithishkumar S',
    image: nithishkumar,
    bio: 'AI & Data Science specialist with hands-on industry experience as a Data Science Intern at Codec Technologies.',
    linkedin: 'linkedin.com/in/nithishkumar-sakthivel-49a7ba365',
  },
  {
    ...seat(5, 'Technical Event Coordinator', 'Technical Events', true),
    name: 'Sanjay S',
    image: sanjay,
    bio: 'Co-founder & CTO of Torkq. Winner of the TN Police Hackathon 2025 Best Idea Award for building secure PII/PCI redaction gateway middleware.',
    linkedin: 'linkedin.com/in/sanjay-s-699585345',
  },
  {
    ...seat(6, 'Joint Technical Event Coordinator', 'Technical Events', false),
    name: 'KP Shohil',
    image: shohil,
    bio: 'Double-phase ML & Data Analytics Intern at Innovate. Winner of Makers Day 2026, specializing in predictive modeling and business intelligence pipelines.',
    linkedin: 'linkedin.com/in/kp-shohil',
  },
  {
    ...seat(7, 'Event Management Coordinator', 'Event Management', true),
    name: 'Regulla Mallika Priyaharshini',
    image: mallika,
    bio: 'AI and Cloud Computing intern with experience at CodSoft and HashTek. Served as Megaplay Coordinator and volunteer in rural social initiatives.',
    linkedin: 'linkedin.com/in/mallika-regulla-059232297',
  },
  {
    ...seat(8, 'Joint Event Management Coordinator', 'Event Management', false),
    name: 'Nithishkumar K',
    image: nithishk,
    bio: 'Cybersecurity researcher and Tamil Nadu’s No. 1 ranked archer, representing the state and securing 7th place in national level archery championships.',
    linkedin: 'linkedin.com/in/nithishkumar-k-691473351',
  },
  {
    ...seat(9, 'Media Coordinator', 'Media', true),
    name: 'Sanjay Nesan J',
    image: sanjaynesan,
    bio: 'Technical Lead of ICCT 26 and Chief Design Officer at I-Intern. Built an Enterprise AI Meeting Intelligence diarization suite and the K-MENTOR AI guidance platform.',
    linkedin: 'linkedin.com/in/sanjaynesan',
  },
  {
    ...seat(10, 'Joint Media Coordinator', 'Media', false),
    name: 'Sona Santhosh',
    image: sona,
    bio: 'Data Analytics Intern at Hexanova Tech Solutions and Head of the NSS Media Team. Skilled in Python data preprocessing, visualization, and creative content creation.',
    linkedin: 'linkedin.com/in/sona-santhosh-urk24ai1040',
  },
  {
    ...seat(11, 'Spiritual Coordinator', 'Spiritual', true),
    name: 'Jemimah Praisy',
    image: jemimah,
    bio: 'Academic rank holder and Software Engineering Intern at Soft Teams Solutions. Certified in AWS and Azure AI, and active as a worship leader and choir director.',
    linkedin: 'linkedin.com/in/jemimahpraisy7',
  },
  {
    ...seat(12, 'Joint Spiritual Coordinator', 'Spiritual', false),
    name: 'Evans T',
    image: evans,
    bio: 'Full-Stack Developer, SIPCOT Hackathon runner-up, and Zonal Football gold medalist. Developed the ASEL AI personalized learning tutor platform.',
    linkedin: '',
  },
];

/** Coordinators grouped into their display panels, preserving order. */
export const coordinatorsByPortfolio = portfolios.map(portfolio => ({
  portfolio,
  members: coordinators.filter(c => c.portfolio === portfolio),
}));
