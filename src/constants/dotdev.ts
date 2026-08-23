// DotDev Club data and imports
import Allen from "@/assets/DOTDEV/Allen.jpg";
import Yakshini from "@/assets/DOTDEV/Yakshini.jpg";
const Jola = null;
const Manisha = null;
const Varsha = null;
import Dot1 from "@/assets/DOTDEV/Dot1.webp";
import Dot2 from "@/assets/DOTDEV/Dot2.webp";
import Dot3 from "@/assets/DOTDEV/Dot3.webp";
import Dot4 from "@/assets/DOTDEV/Dot4.webp";
import Dot5 from "@/assets/DOTDEV/Dot5.webp";
import Dot6 from "@/assets/DOTDEV/Dot6.webp";
import Dot7 from "@/assets/DOTDEV/Dot7.webp";
import Dot8 from "@/assets/DOTDEV/Dot8.webp";
import Dot9 from "@/assets/DOTDEV/Dot9.webp";
import Dot10 from "@/assets/DOTDEV/Dot10.webp";
import Dot13 from "@/assets/DOTDEV/Dot13.webp";
import Dot14 from "@/assets/DOTDEV/Dot14.webp";
import DotIcon from "@/assets/Dot.ico";

export { DotIcon };

export const dotdevClub = {
  id: 2,
  name: "DotDev Club",
  icon: DotIcon,
  description:
    "Dotdev is a student community for aspiring software engineers focused on full-stack development.",
  objectives:
    "Develop members' problem-solving, logical, and communication skills. Master full-stack development through hands-on workshops and collaborative projects. Build a strong, supportive community of student developers.",
  extraInfo:
    "DotDev Club organizes hackathons, code sprints, mentorship sessions, and collaborative projects for members. The club has built over 50+ web applications and mobile apps, with members securing internships at top tech companies.",
  coordinators: [
    {
      name: "Allen John Isac",
      role: "Coordinator",
      image: Allen,
      isMain: true,
      bio: "Skilled in AI/ML, Data Science, and Full-Stack Development. Led the development of VOX, an assistive voice-first exam platform, and recognized for leadership in technology and NSS initiatives.",
      linkedin: "linkedin.com/in/allen-john-isac-7b6730363",
    },
    {
      name: "Yakshini S",
      role: "Junior Coordinator",
      image: Yakshini,
      isMain: false,
      bio: "Skilled in AI and Full-Stack Development, with 19+ certifications, a 3rd-place finish at Mindkraft Expo 2026, and hands-on internship experience in full-stack development.",
      linkedin: "",
    },
    {
      name: "Manisha S",
      role: "Educator",
      image: Manisha,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/manisha-c",
    },
    {
      name: "Jola Kaseena C",
      role: "Educator",
      image: Jola,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/jola-keseena-b0895a2a9",
    },
    {
      name: "Varsha S",
      role: "Educator",
      image: Varsha,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/varsha-nadarajan",
    },

  ],
  projects: [
    {
      name: "DevHub Platform",
      description: "A collaborative development platform for students to share projects, find teammates, and showcase their work.",
      github: "https://github.com/dotdev/devhub"
    },
    {
      name: "CodeMentor App",
      description: "Mobile application connecting junior developers with experienced mentors for guidance and career development.",
      github: "https://github.com/dotdev/codementor"
    },
    {
      name: "TechStack Builder",
      description: "Interactive tool to help developers choose the right technology stack for their projects.",
      github: "https://github.com/dotdev/techstack"
    }
  ],
  gallery: [
    Dot1,
    Dot2,
    Dot3,
    Dot4,
    Dot5,
    Dot6,
    Dot7,
    Dot8,
    Dot9,
    Dot10,
    Dot13,
    Dot14,
  ]
};