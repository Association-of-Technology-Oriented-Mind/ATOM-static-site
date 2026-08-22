// Career Guidance Club data and imports
const Renimol = null;
const Jola = null;
import { Globe } from "lucide-react";

export const careerGuidanceClub = {
  id: 5,
  name: "Career Guidance Club",
  icon: Globe,
  description:
    "The Career Guidance Club is established to provide students with direction and support in shaping their academic and professional journey. The club acts as a bridge between classroom learning and future career opportunities by offering mentorship, resources, and skill-development initiatives.",
  objectives:
    "To guide students in exploring career opportunities aligned with their skills and aspirations. To organize workshops, seminars, and expert talks on higher studies, placements, and entrepreneurship. To enhance professional skills such as resume writing, communication, and interview techniques. To build awareness about industry trends, competitive exams, and emerging career fields. To foster a supportive environment that encourages growth, confidence, and informed choices.",
  extraInfo:
    "Career Guidance Club has successfully placed 200+ students in top companies, conducted 50+ career workshops, and established partnerships with leading recruitment agencies and educational institutions.",
  coordinators: [
    {
      name: "Renimol S",
      role: "Coordinator",
      image: Renimol,
      isMain: true,
      bio: "As Coordinator of Career Guidance, Renimol S was awarded as the best female solo dancer and trained under infosys pragati cohort 2024. She was recognized by the department for completing numerous certifications and online courses.",
      linkedin: "linkedin.com/in/renimol-suresh-a04095267",
    },
    {
      name: "Jola Kaseena C",
      role: "Junior Coordinator",
      image: Jola,
      isMain: false,
      bio: "As Junior Coordinator of Career Guidance, Jola Keseena C is passionate about Machine learning, Java, and Data science. She won several dance competitions and has created projects such as an IoT and AI-based field guardian prototype and a food delivery management system. She is also a Data Science intern at Unified mentor.",
      linkedin: "linkedin.com/in/jola-keseena-b0895a2a9",
    },
  ],
  projects: [
    {
      name: "CareerPath Tracker",
      description: "AI-powered platform that analyzes student skills and suggests personalized career paths and learning resources.",
      github: "https://github.com/careerguide/careerpath"
    },
    {
      name: "InterviewPrep Pro",
      description: "Comprehensive interview preparation platform with mock interviews, feedback, and industry-specific questions.",
      github: "https://github.com/careerguide/interviewprep"
    },
    {
      name: "Skill Assessment Tool",
      description: "Interactive platform for students to assess their technical and soft skills with personalized improvement plans.",
      github: "https://github.com/careerguide/skill-assessment"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop"
  ]
};