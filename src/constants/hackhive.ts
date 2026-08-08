// HackHive Club data and imports
import Sanjay from '@/assets/HACKHIVE/Sanjay.webp';
import Jayesh from "@/assets/HACKHIVE/Jayesh.webp";
import Leo from '@/assets/HACKHIVE/Leo.webp';
import Gre from '@/assets/Gre.webp';
import Nithish from "@/assets/Nithishkumar.webp";
import Hack1 from "@/assets/HACKHIVE/Hack1.webp";
import Hack2 from "@/assets/HACKHIVE/Hack2.webp";
import Hack3 from "@/assets/HACKHIVE/Hack3.webp";
import Hack4 from "@/assets/HACKHIVE/Hack4.webp";
import Hack5 from "@/assets/HACKHIVE/Hack5.webp";
import Hack6 from "@/assets/HACKHIVE/Hack6.webp";
import Hack7 from "@/assets/HACKHIVE/Hack7.webp";
import HackIcon from "@/assets/HACKHIVE/Hack.ico";
import Pooja from "@/assets/UNBIAS/Pooja.webp";

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
      name: "Sanjay S",
      role: "Coordinator",
      image: Sanjay,
      isMain: true,
      bio: "As Coordinator of Hack Hive, Sanjay S is a finalist in the Cyberthon and was awarded the Best Idea Award at the TN-Police Hackathon.",
      linkedin: "linkedin.com/in/sanjay-s-699585345",
    },
    {
      name: "Jayesh",
      role: "Joint Coordinator",
      image: Jayesh,
      isMain: false,
      bio: "As Junior Coordinator of Hack Hive, Jayesh V Prakash Naidu is passionate about DIGITAL FORENSICS and created a Wi-Fi penetration-testing device to learn networking. He is also the founder of BlackSpotAI, a cybersecurity project.",
      linkedin: "linkedin.com/in/jayesh-v-prakash-naidu",
    },
    {
      name: "Gregory Joe Jeni C",
      role: "Educator",
      image: Gre,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/gregory-joe-jeni-0850142bb",
    },
    {
      name: "Nithishkumar K",
      role: "Educator",
      image: Nithish,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/nithishkumar-k-691473351",
    },
    {
      name: "Leo Francis A",
      role: "Educator",
      image: Leo,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/leo-francis-a-a9092531b",
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