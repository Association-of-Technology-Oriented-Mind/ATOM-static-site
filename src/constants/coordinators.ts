import deepakumar from '@/assets/UNBIAS/Deepakumar.webp';
import thirupathi from '@/assets/Thirupathi S.webp';
import lebi from '@/assets/Lebi.jpg';
import nithishkumar from '@/assets/NithishkumarS.jpg';
import sanjay from '@/assets/SanjayS.webp';
import shohil from '@/assets/Shohil.jpg';
import mallika from '@/assets/Mallika.jpg';
import nithishk from '@/assets/NithishK.jpg';
import sona from '@/assets/Sona.jpg';
import jemimah from '@/assets/Jemimah.webp';
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
  regNo?: string;
  kmail?: string;
  year?: string;
  achievements?: string[];
  academic?: string;
  expertise?: string[];
  experience?: string;
  projects?: string[];
  sports?: string;
  outreach?: string;
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
    regNo: 'URK23CO2014',
    kmail: 'deepakumar23@karunya.edu.in',
    year: 'IV Year',
    achievements: [
      'Agam 7.0 2024 best idea award winner',
      'Tamil Nadu Police Hackathon 2025 5th place',
      'Cyberthon 2025 Best idea winner'
    ],
    expertise: ['Cyber security', 'cryptography', 'ai governance and monitoring'],
    experience: 'Co-Founder | CEO of torkq secure ai gateway platform',
    projects: [
      'VOIP CRACK: Tool to crack and track the voip calls (eg: whatsapp call, telegram calls) this tool is made for tamil nadu police',
      'DATA RECOVERY TOOL FOR XFS & BTRFS FILE SYSTEM: Recovery tool for linux file systems',
      'SECURE CHAT & FILE SHARING APPLICATION USING ADVANCED ENCRYPTION AND PQC CRYPTOGRAPHY TECHNIQUES',
      'TORKQ: Secure AI gateway platform now commercialized as startup product'
    ]
  },
  {
    ...seat(2, 'Joint Secretary', 'Secretariat', false),
    name: 'Lebi Raja C',
    image: lebi,
    bio: 'Junior Software Engineer Intern at Fludigo, specializing in Generative AI, DevOps, and System Design. Winner of Makers Day 2026, Meta × PyTorch Hackathon finalist, and creator of the Athena Indic voice cloning platform.',
    linkedin: 'linkedin.com/in/lebiraja',
    regNo: 'URK24AI1005',
    kmail: 'lebiraja@karunya.edu.in',
    year: 'III Year',
    achievements: [
      'Winner - Makers Day 2026 secured first place by doing a career mentor',
      'Meta x pytorch hackathon finalist happened in Scalar school of technology',
      'Runner up of BI3 bytes hackathon conducted by BI3 technologies'
    ],
    expertise: ['Generative AI', 'Agentic AI', 'Devops', 'System design'],
    experience: 'Junior Software Engineer intern - Fludigo Private limited, chennai. Present and working on real world projects.',
    projects: [
      'Open source project developer and contributor have released some package on NPM & PIP.',
      'Athena: Indic translation with Zero shot voice cloning'
    ]
  },
  {
    ...seat(3, 'Treasurer', 'Treasury', true),
    name: 'Thirupathi S',
    image: thirupathi,
    bio: 'Software Engineer Intern at GMS and National Level Technoverse Hackathon winner. Main developer of DrugTrace, a LangGraph and Neo4j multi-agent AI drug repurposing platform.',
    linkedin: 'linkedin.com/in/thirupathi-s',
    regNo: 'URK23AI1015',
    kmail: 'thirupathis@karunya.edu.in',
    year: 'IV Year',
    achievements: ['National Level Technoverse Hackathon Winner'],
    academic: 'Nil',
    expertise: ['Artificial Intelligence and Machine Learning'],
    experience: 'Software Engineer Intern - GMS',
    projects: [
      'DrugTrace – Multi-Agent AI Drug Repurposing Platform: designed the multi-agent workflows and integrated graph-based and document-based data systems (FastAPI, LangGraph, LLMs, NVIDIA NeMo, Neo4j, MongoDB).'
    ],
    sports: 'Nil',
    outreach: 'Nil'
  },
  {
    ...seat(4, 'Joint Treasurer', 'Treasury', false),
    name: 'Nithishkumar S',
    image: nithishkumar,
    bio: 'AI & Data Science specialist with hands-on industry experience as a Data Science Intern at Codec Technologies.',
    linkedin: 'linkedin.com/in/nithishkumar-sakthivel-49a7ba365',
    regNo: 'URK24AI1008',
    kmail: 'nithishkumarsakthivel@karunya.edu.in',
    year: 'III Year',
    expertise: ['Artificial intelligence and data science'],
    experience: 'Data science intern in codec Technologies'
  },
  {
    ...seat(5, 'Technical Event Coordinator', 'Technical Events', true),
    name: 'Sanjay S',
    image: sanjay,
    bio: 'Co-founder & CTO of Torkq. Winner of the TN Police Hackathon 2025 Best Idea Award for building secure PII/PCI redaction gateway middleware.',
    linkedin: 'linkedin.com/in/sanjay-s-699585345',
    regNo: 'URK23CO2022',
    kmail: 'sanjay23@karunya.edu.in',
    year: 'IV Year',
    achievements: ['Tn Police Hackathon 2025 - best idea award'],
    expertise: ['Cybersecurity'],
    experience: 'Torkq - co founder | cto',
    projects: ['Torkq - An safe llm gateway for pii/pci redaction and easy compliance']
  },
  {
    ...seat(6, 'Joint Technical Event Coordinator', 'Technical Events', false),
    name: 'KP Shohil',
    image: shohil,
    bio: 'Double-phase ML & Data Analytics Intern at Innovate. Winner of Makers Day 2026, specializing in predictive modeling and business intelligence pipelines.',
    linkedin: 'linkedin.com/in/kp-shohil',
    regNo: 'URK24AI1001',
    kmail: 'kpshohil@karunya.edu.in',
    year: 'III Year',
    achievements: ['Winner – Makers Day Event; secured 1st place in the Makers Day competition organized by the department.'],
    expertise: ['AI/ML & Data Science'],
    experience: 'ML/Data Analytics Intern – Innovate | June–July 2025 & May–July 2026 | Worked on machine learning and data analytics projects across two internship phases.'
  },
  {
    ...seat(7, 'Event Management Coordinator', 'Event Management', true),
    name: 'Regulla Mallika Priyaharshini',
    image: mallika,
    bio: 'AI and Cloud Computing intern with experience at CodSoft and HashTek. Served as Megaplay Coordinator and volunteer in rural social initiatives.',
    linkedin: 'linkedin.com/in/mallika-regulla-059232297',
    regNo: 'URK23AI1026',
    kmail: 'mallikaregulla@karunya.edu.in',
    year: 'IV Year',
    expertise: ['Artificial Intelligence, Deep Learning, Machine Learning'],
    experience: 'Artificial Intelligence Intern at CodSoft (Sep 2025 – Oct 2025), Cloud Computing Intern (AWS) at HashTek Solutions (Jun 2025), Data Science Intern at Remarkskill (Jun 2024 – Jul 2024)',
    sports: 'Coordinator, Megaplay — actively organized and coordinated the play for 2024, 2025.',
    outreach: 'Mission trip in Sangli, Maharashtra in March 2026'
  },
  {
    ...seat(8, 'Joint Event Management Coordinator', 'Event Management', false),
    name: 'Nithishkumar K',
    image: nithishk,
    bio: 'Cybersecurity researcher and Tamil Nadu’s No. 1 ranked archer, representing the state and securing 7th place in national level archery championships.',
    linkedin: 'linkedin.com/in/nithishkumar-k-691473351',
    regNo: 'URK24CO2022',
    kmail: 'nithishkumark24@karunya.edu.in',
    year: 'III Year',
    achievements: ['National level player in archery and got 7 place in nationals and holding tamilnadu no.1 archer'],
    expertise: ['Cybersecurity'],
    sports: 'Archery'
  },
  {
    ...seat(9, 'Media Coordinator', 'Media', true),
    name: 'Sanjay Nesan J',
    image: sanjaynesan,
    bio: 'Technical Lead of ICCT 26 and Chief Design Officer at I-Intern. Built an Enterprise AI Meeting Intelligence diarization suite and the K-MENTOR AI guidance platform.',
    linkedin: 'linkedin.com/in/sanjaynesan',
    regNo: 'URK23AI1041',
    kmail: 'sanjaynesan@karunya.edu.in',
    year: 'IV Year',
    achievements: [
      'Nexus – 1st Place (16 Feb 2024)',
      'MathBee Inter-College Event – 1st Place (27 Feb 2024)',
      'Mindkraft IPL Auction – Event Organizer (21 March 2025)',
      'Code O’ Clock Inter-College Hackathon – Top 10 (26–27 Sep 2025)',
      'Innovate-X Hackathon – Top 10 (2–3 Sep 2025)',
      'Google Hackathon – Top 50 out of 600 (8 Oct 2025)',
      'ICCT ’26 – Technical Lead (24–26 Jan 2026)'
    ],
    academic: 'Chief Frontend & Design Officer (CFDO) at I-Intern, completed training in Data Visualization & Analysis at Infomedia Services, Full Stack Development at Nandha Info Tech.',
    expertise: [
      'Artificial Intelligence / Machine Learning',
      'Generative AI & Large Language Models',
      'Full-Stack Web Development',
      'Natural Language Processing',
      'Computer Vision',
      'Backend Development & REST APIs',
      'Data Analytics',
      'Cloud & Software Engineering'
    ],
    experience: 'Graphic Designer (Freelance, 2023-Present), Data Visualization Intern at Infomedia Services (June-July 2024), Full Stack Developer Intern at Nandha Info Tech (June-July 2025), CFDO at I-Intern (July 2025-Feb 2026)',
    projects: [
      'Enterprise AI Meeting Intelligence System (React, WhisperX, Ollama)',
      'Family Roots – Digital Family Tree',
      'AI Mentor (K-MENTOR) – career-oriented recommendations',
      'I-Intern – Frontend architecture, UI/UX, design systems'
    ],
    sports: 'Master of Ceremonies (MC) for various events, active in event management, art, and creative design.',
    outreach: 'Active in church children’s ministry, youth fellowship, and choir, supporting event coordination and digital media.'
  },
  {
    ...seat(10, 'Joint Media Coordinator', 'Media', false),
    name: 'Sona Santhosh',
    image: sona,
    bio: 'Data Analytics Intern at Hexanova Tech Solutions and Head of the NSS Media Team. Skilled in Python data preprocessing, visualization, and creative content creation.',
    linkedin: 'linkedin.com/in/sona-santhosh-urk24ai1040',
    regNo: 'URK24AI1040',
    kmail: 'sonasanthosh24@karunya.edu.in',
    year: 'III Year',
    expertise: ['Photography', 'Videography', 'Creative content creation'],
    experience: 'Data Analytics Intern – Hexanova Tech Solutions, Kochi | May 2026 – June 2026 | Worked on data analysis, preprocessing, visualization, and extracting insights using Python, Pandas, NumPy, Matplotlib, and SQL.',
    sports: 'Head of NSS Media Team with experience in photography, videography, event coordination, and creative content creation.',
    outreach: 'Actively participated in cultural activities, social initiatives, and college events.'
  },
  {
    ...seat(11, 'Spiritual Coordinator', 'Spiritual', true),
    name: 'Jemimah Praisy',
    image: jemimah,
    bio: 'Academic rank holder and Software Engineering Intern at Soft Teams Solutions. Certified in AWS and Azure AI, and active as a worship leader and choir director.',
    linkedin: 'linkedin.com/in/jemimahpraisy7',
    regNo: 'URK24AI1088',
    kmail: 'jemimahpraisy@karunya.edu.in',
    year: 'III Year',
    academic: 'Academic Rank Holder, certifications in AWS, Microsoft Azure AI Essentials and Introduction to Large Language Models (LLMs).',
    expertise: ['Artificial Intelligence', 'Full-Stack Development', 'Data Science'],
    experience: 'Currently working as a Software Engineering Intern at Soft Teams Solutions Pvt. Ltd. (GMS), Chennai.',
    outreach: 'Singer, Worship Leader, Preacher and Keyboard Player; actively involved in counselling, prayer meetings, fellowships, and other spiritual activities.'
  },
  {
    ...seat(12, 'Joint Spiritual Coordinator', 'Spiritual', false),
    name: 'Evans T',
    image: evans,
    bio: 'Full-Stack Developer, SIPCOT Hackathon runner-up, and Zonal Football gold medalist. Developed the ASEL AI personalized learning tutor platform.',
    linkedin: '',
    regNo: 'URK25AI1058',
    kmail: 'evanst@karunya.edu.in',
    year: 'II Year',
    achievements: [
      '2nd place SIPCOT Hackathon 2022 (50,000 INR cash prize)',
      'Banged Gold in Football Zonals and Bronze 100m Sprint (2023-24)'
    ],
    academic: 'Institutional Merit Scholarship in Karunya University',
    expertise: ['Artificial Intelligence', 'Full Stack Web Development'],
    experience: 'Full Stack Web Development - Codsoft | June 2026',
    projects: [
      'ASEL Platform - An AI tutoring assistant for personalized learning for Business Platform.'
    ],
    sports: 'Football, Athletics 100m Sprint',
    outreach: 'Volunteer in Community service and Spiritual Service Activities'
  },
];

/** Coordinators grouped into their display panels, preserving order. */
export const coordinatorsByPortfolio = portfolios.map(portfolio => ({
  portfolio,
  members: coordinators.filter(c => c.portfolio === portfolio),
}));
