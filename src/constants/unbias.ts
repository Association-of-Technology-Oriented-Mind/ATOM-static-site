// UnBias Club data and imports
const Aravind = null;
const Ronnie = null;
import Aparna from '@/assets/UNBIAS/Aparna.webp';
import Lebi from '@/assets/UNBIAS/Lebi.webp';
import Thirupathy from '@/assets/Thirupathi S.webp';
import Pooja from '@/assets/UNBIAS/Pooja.webp';
import Vasuki from '@/assets/UNBIAS/Vasuki.webp';
// Note: Unbias1.jpg, Unbias3.jpg, and Unbias7.jpg don't exist
import Bias1 from "@/assets/UNBIAS/IMG-20250913-WA0012.webp";
import Bias2 from "@/assets/UNBIAS/Unbias2.webp";
import Bias4 from "@/assets/UNBIAS/Unbias4.webp";
import Bias6 from "@/assets/UNBIAS/Unbias6.webp";
import BiasPhoto1 from "@/assets/UNBIAS/PXL_20251014_110651221.webp";
import BiasPhoto2 from "@/assets/UNBIAS/PXL_20251014_110656735.webp";
import BiasPhoto3 from "@/assets/UNBIAS/PXL_20251014_110701675.webp";
import BiasPhoto4 from "@/assets/UNBIAS/PXL_20251014_110723049.webp";
import BiasIcon from "@/assets/UNBIAS/Bias.ico";

export { BiasIcon };

export const unbiasClub = {
  id: 3,
  name: "Unbiased Club",
  icon: BiasIcon,
  description:
    "The Unbiased AI Club is a student-driven community exploring AI, ML, DL, NLP, Generative AI, and Agents. We encourage hands-on learning, collaboration, and innovation to build impactful projects for our department and beyond.",
  objectives:
    "Build a strong foundation in AI through regular sessions. Promote hands-on projects and innovation. Foster collaboration and knowledge sharing. Prepare students for research, industry, and competitions. Develop a department-focused AI product.",
  extraInfo:
    "Unbiased Club conducts weekly AI workshops, research paper discussions, and hands-on ML projects. Members have published 10+ research papers and won multiple AI competitions including national-level hackathons.",
  coordinators: [
    {
      name: "Aravindan",
      role: "Coordinator",
      image: Aravind,
      isMain: true,
      bio: "As Coordinator of Unbias, Aravindan M is a Silver Medalist in the International Taekwondo Championship and a finalist at IIT Bombay's Eureka 2024. He is specialized in Generative AI and is the Head of AI at Rapha MedTech.",
      linkedin: "linkedin.com/in/aravindan-arru",
    },
    {
      name: "Ronnie A Jeffrey",
      role: "Junior Coordinator",
      image: Ronnie,
      isMain: false,
      bio: "As Junior Coordinator of Unbias, Ronnie A Jeffrey is a winner in NEXUS 2024 and was awarded a special mention at Cyberthon '25. He is passionate about AI and Full Stack development.",
      linkedin: "linkedin.com/in/ronnie-a-jeffrey",
    },
    {
      name: "Aparna",
      role: "Educator",
      image: Aparna,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/aparna-j-a13647297",
    },
    {
      name: "Thirupathi",
      role: "Educator",
      image: Thirupathy,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/thirupathis",
    },
    {
      name: "Vasuki",
      role: "Educator",
      image: Vasuki,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/vasuki-g-0b31a9288",
    },
    {
      name: "Lebi Raja",
      role: "Educator",
      image: Lebi,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/lebiraja",
    },
    {
      name: "Pooja",
      role: "Educator",
      image: Pooja,
      isMain: false,
      bio: "",
      linkedin: "linkedin.com/in/pooja-s-1190862b8/",
    },
  ],
  projects: [
    {
      name: "SmartPredict AI",
      description: "Machine learning model for predicting student performance and providing personalized learning recommendations.",
      github: "https://github.com/unbias/smartpredict"
    },
    {
      name: "NLP Chatbot Assistant",
      description: "Advanced natural language processing chatbot for student queries and academic support using transformers.",
      github: "https://github.com/unbias/nlp-assistant"
    },
    {
      name: "Computer Vision Toolkit",
      description: "Comprehensive toolkit for image processing and computer vision applications in educational contexts.",
      github: "https://github.com/unbias/cv-toolkit"
    }
  ],
  gallery: [
    Bias1,
    Bias2,
    Bias4,
    Bias6,
    BiasPhoto1,
    BiasPhoto2,
    BiasPhoto3,
    BiasPhoto4,
  ]
};