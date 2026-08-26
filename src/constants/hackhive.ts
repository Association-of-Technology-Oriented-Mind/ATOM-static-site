// HackHive Club data and imports
import Jefferson from '@/assets/HACKHIVE/Jefferson.jpg';
import Dave from "@/assets/HACKHIVE/Dave.png";
import Nithish from "@/assets/NithishK.jpg";
import Hack1 from "@/assets/HACKHIVE/Hack1.webp";
import Hack2 from "@/assets/HACKHIVE/Hack2.webp";
import Hack3 from "@/assets/HACKHIVE/Hack3.webp";
import Hack4 from "@/assets/HACKHIVE/Hack4.webp";
import Hack5 from "@/assets/HACKHIVE/Hack5.webp";
import Hack6 from "@/assets/HACKHIVE/Hack6.webp";
import Hack7 from "@/assets/HACKHIVE/Hack7.webp";
import HackIcon from "@/assets/HACKHIVE/Hack.ico";

export { HackIcon };

export const hackhiveClub = {
  id: 1,
  name: "Hack Hive Club",
  icon: HackIcon,
  description:
    "Hack Hive is a student-driven cybersecurity club that brings together passionate individuals to explore, learn, and innovate in the field of information security.",
  objectives:
    "To spread cybersecurity awareness among students and faculty. To conduct hands-on workshops, Capture The Flag (CTF) competitions, and hackathons. To build a strong community of ethical hackers and cybersecurity enthusiasts.",
  extraInfo:
    "Hack Hive hosts weekly learning sessions, invites industry experts for talks, and participates in national cybersecurity competitions. The club has successfully organized multiple CTF events and security workshops that have benefited over 200+ students.",
  coordinators: [
    {
      name: "Jefferson Raja",
      role: "Coordinator",
      image: Jefferson,
      isMain: true,
      bio: "Cybersecurity researcher and software developer. Winner of Smart India Hackathon, Aurelion Hackathon 3rd-place winner, and finalist in Meta × Scalar and Cyberthon.",
      linkedin: "linkedin.com/in/jefferson-raja/",
    },
    {
      name: "Dave V Shah",
      role: "Junior Coordinator",
      image: Dave,
      isMain: false,
      bio: "Smart India Hackathon 2025 winner. Cryptography and network security researcher who designed RTT temporal anomaly detection and custom DRM media protection protocols.",
      linkedin: "",
    },
    {
      name: "Nithishkumar K",
      role: "Educator",
      image: Nithish,
      isMain: false,
      bio: "Cybersecurity researcher and Tamil Nadu’s No. 1 ranked archer, representing the state and securing 7th place in national level archery championships.",
      linkedin: "linkedin.com/in/nithishkumar-k-691473351",
    }
  ],
  projects: [
    {
      name: "CyberGuard Platform",
      description: "A comprehensive security monitoring platform that detects and prevents cyber threats in real-time using advanced AI algorithms.",
      github: "https://github.com/hackhive/cyberguard"
    },
    {
      name: "EthicalHack Toolkit",
      description: "An educational toolkit for learning ethical hacking and penetration testing techniques with hands-on exercises.",
      github: "https://github.com/hackhive/ethical-toolkit"
    },
    {
      name: "SecureNet Analyzer",
      description: "Network security analysis tool that identifies vulnerabilities and provides security recommendations.",
      github: "https://github.com/hackhive/securenet"
    }
  ],
  gallery: [
    Hack1,
    Hack2,
    Hack3,
    Hack4,
    Hack5,
    Hack6,
    Hack7,
  ]
};