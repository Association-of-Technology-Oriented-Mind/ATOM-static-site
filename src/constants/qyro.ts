// Qyro Club data and imports
import Alain from '@/assets/QYRO/Alain.jpg';
import Ankitha from '@/assets/QYRO/Ankitha.jpg';
import qyroLogo from '@/assets/qyro.webp';

export const qyroClub = {
  id: 4,
  name: "Qyro Club",
  icon: qyroLogo,
  description:
    "The Qyro Club under ATOM is a hub for innovation, turning real-world challenges into smart, practical, and startup-ready solutions. It empowers students to explore ideas, build prototypes, and collaborate with industry experts to bring innovations to life.",
  objectives:
    "To identify real-world problems, foster creativity and innovation, guide students in building impactful projects, connect them with industry leaders and startups, and promote a strong research and entrepreneurship culture on campus.",
  extraInfo:
    "Qyro Club has incubated 15+ startup ideas, secured funding for 5 student projects, and established partnerships with 10+ industry leaders. The club organizes innovation challenges and prototype development workshops.",
  coordinators: [
    {
      name: "Alain Abraham",
      role: "Coordinator",
      image: Alain,
      isMain: true,
      bio: "Quantum Engineer Intern at Artificial Brain and AP Quantum Hackathon runner-up. IBM Quantum certified researcher specializing in VQE-based molecular ground state algorithms.",
      linkedin: "linkedin.com/in/alain-abraham-b91193304",
    },
    {
      name: "Thumma Ankitha Ignatious",
      role: "Junior Coordinator",
      image: Ankitha,
      isMain: false,
      bio: "AI/ML scholar and Python intern at Internzvally. Developed AI voice control systems, biometric voting interfaces, and predictive heart disease models.",
      linkedin: "",
    },
  ],
  projects: [
    {
      name: "InnovateLab Platform",
      description: "A comprehensive platform for managing research projects, connecting with mentors, and tracking innovation progress.",
      github: "https://github.com/qyroclub/innovatelab"
    },
    {
      name: "StartupHub Network",
      description: "Networking platform connecting student entrepreneurs with investors, mentors, and industry experts.",
      github: "https://github.com/qyroclub/startuphub"
    },
    {
      name: "Research Repository",
      description: "Digital library for storing, sharing, and collaborating on research papers and project documentation.",
      github: "https://github.com/qyroclub/research-repo"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop"
  ]
};
