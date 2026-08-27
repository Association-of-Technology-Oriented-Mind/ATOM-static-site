import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, Github, Linkedin, Maximize2, X, Target, Users, Code } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useClubs } from '@/hooks/useContent';
import { hackhiveClub } from '@/constants/hackhive';
import { dotdevClub } from '@/constants/dotdev';
import { unbiasClub } from '@/constants/unbias';
import { qyroClub } from '@/constants/qyro';

const ease = [0.16, 1, 0.3, 1] as const;

const getClubData = (slug?: string) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  if (s === 'hackhive') return hackhiveClub;
  if (s === 'dotdev') return dotdevClub;
  if (s === 'unbias' || s === 'unbiased') return unbiasClub;
  if (s === 'qyro') return qyroClub;
  return null;
};

const getClubThemeColor = (slug?: string) => {
  if (!slug) return '168 90% 74%'; // Default precision phosphor
  const s = slug.toLowerCase();
  if (s === 'hackhive') return '142 80% 60%'; // Bright Cyber Green
  if (s === 'dotdev') return '230 100% 75%'; // Bright Electric Indigo
  if (s === 'unbias' || s === 'unbiased') return '270 80% 75%'; // Bright Amethyst
  if (s === 'qyro') return '35 100% 65%'; // Bright Amber
  return '168 90% 74%';
};

const formatLinkedIn = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();

// ──────────────────────────────────────────────────────────
// 3D TILT CARD COMPONENT
// ──────────────────────────────────────────────────────────
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${className || ''}`}
    >
      {/* Subtle glowing shadow behind the card on hover */}
      <div 
        className="absolute -inset-1 bg-[hsl(var(--phosphor))] opacity-0 group-hover:opacity-20 blur-xl rounded-3xl transition-opacity duration-700 pointer-events-none"
        style={{ transform: "translateZ(-20px)" }}
      />
      
      {/* Premium Glass Container */}
      <div className="h-full w-full bg-[#121212]/60 backdrop-blur-2xl border border-white/5 group-hover:border-[hsl(var(--phosphor))/0.4] transition-colors duration-500 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Shine effect across the card */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none"
        />
        {children}
      </div>
    </motion.div>
  );
};

// ──────────────────────────────────────────────────────────
// FLOATING AMBIENT ORBS
// ──────────────────────────────────────────────────────────
const FloatingOrbs = ({ color }: { color: string }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div 
        animate={{ 
          x: [0, 80, -40, 0], 
          y: [0, -80, 40, 0],
          scale: [1, 1.15, 0.85, 1] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-10 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.12] blur-[120px] mix-blend-screen"
        style={{ background: `radial-gradient(circle, hsl(${color}) 0%, transparent 60%)` }}
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 50, 0], 
          y: [0, 60, -50, 0],
          scale: [1, 1.1, 0.9, 1] 
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 -right-10 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full opacity-[0.1] blur-[120px] mix-blend-screen"
        style={{ background: `radial-gradient(circle, hsl(${color}) 0%, transparent 60%)` }}
      />
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-screen" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
        }}
      />
    </div>
  );
};


const ClubPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: storedClubs } = useClubs();
  
  const club = storedClubs && slug
    ? storedClubs.find(c => c.slug?.toLowerCase() === slug.toLowerCase() || c.id?.toString().toLowerCase() === slug.toLowerCase()) || getClubData(slug)
    : getClubData(slug);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!club) {
    return (
      <div className="min-h-screen bg-[hsl(var(--ink))] flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-24">
          <h1 className="display-l text-[hsl(var(--chalk))] uppercase mb-4">Club Not Found</h1>
          <p className="editorial-body text-[hsl(var(--chalk)/0.6)] mb-8">
            The dossier you are looking for does not exist or has been relocated.
          </p>
          <button 
            onClick={() => navigate('/#clubs-section')} 
            className="inline-flex items-center gap-3 mono-label text-xs tracking-widest text-[hsl(var(--chalk))] hover:text-[hsl(var(--phosphor))] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO DIRECTORY</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const nameParts = club.name.split(' ');
  const lastWord = nameParts.pop();
  const firstWords = nameParts.join(' ');
  
  const domain = club.name.toLowerCase().includes('hack') ? 'CYBERSECURITY' : 
                 club.name.toLowerCase().includes('dev') ? 'SOFTWARE' : 
                 club.name.toLowerCase().includes('qyro') || club.name.toLowerCase().includes('r&d') ? 'R&D' : 'TECHNOLOGY';

  const themeColor = getClubThemeColor(slug);

  return (
    <div 
      className="min-h-screen bg-[#0A0A0A] relative selection:bg-[hsl(var(--phosphor))] selection:text-[hsl(var(--ink))] font-body"
      style={{ '--phosphor': themeColor } as React.CSSProperties}
    >
      <FloatingOrbs color={themeColor} />
      <Navigation />

      {/* ──────────────────────────────────────────────────────────
          PREMIUM CENTERED HERO
      ────────────────────────────────────────────────────────── */}
      <header ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden z-10 text-center px-6">
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          onClick={() => navigate('/#clubs-section')}
          className="absolute top-28 left-6 md:left-12 inline-flex items-center gap-3 mono-label text-xs tracking-widest text-white/50 hover:text-[hsl(var(--phosphor))] transition-colors z-20 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>DIRECTORY</span>
        </motion.button>

        {/* Central Logo */}
        {club.icon && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale: logoScale, opacity: logoOpacity, y: yParallax }}
            className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-8 relative z-0 flex items-center justify-center"
          >
            {typeof club.icon === 'string' ? (
              <img src={club.icon} alt={club.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
            ) : (
              (() => {
                const IconComponent = club.icon as any;
                return <IconComponent className="w-2/3 h-2/3 text-[hsl(var(--phosphor))] relative z-10 drop-shadow-2xl" />;
              })()
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          style={{ y: yParallax }}
          className="relative z-10 flex flex-col items-center max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--phosphor))] shadow-[0_0_8px_hsl(var(--phosphor))]" />
            <span className="mono-label text-white/70 uppercase tracking-[0.2em] text-[0.65rem]">
              DOMAIN: {domain}
            </span>
          </div>
          
          <h1 className="leading-[0.9] flex flex-col uppercase m-0 mb-8" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 10vw, 8rem)', letterSpacing: '-0.04em' }}>
            <span className="text-white drop-shadow-xl">{firstWords}</span>
            {lastWord && (
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/20">
                {lastWord}
              </span>
            )}
          </h1>

          <p className="editorial-body text-white/60 text-lg sm:text-xl md:text-2xl leading-[1.6] max-w-2xl font-light">
            {club.description}
          </p>
        </motion.div>
      </header>


      <main className="relative z-10 max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col gap-32 pb-32">
        
        {/* ──────────────────────────────────────────────────────────
            GLASS OBJECTIVES & IMPACT
        ────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <TiltCard className="h-full">
            <div className="p-8 sm:p-12 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--phosphor))/0.1] border border-[hsl(var(--phosphor))/0.2] flex items-center justify-center mb-8">
                <Target className="w-6 h-6 text-[hsl(var(--phosphor))]" />
              </div>
              <h2 className="mono-label text-white tracking-[0.2em] uppercase text-xs mb-6">Mission Objectives</h2>
              <p className="text-lg sm:text-xl leading-[1.6] text-white/70 font-light flex-1">
                {club.objectives}
              </p>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="p-8 sm:p-12 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--phosphor))/0.1] border border-[hsl(var(--phosphor))/0.2] flex items-center justify-center mb-8">
                <Users className="w-6 h-6 text-[hsl(var(--phosphor))]" />
              </div>
              <h2 className="mono-label text-white tracking-[0.2em] uppercase text-xs mb-6">Impact & Scope</h2>
              <p className="text-lg sm:text-xl leading-[1.6] text-white/70 font-light flex-1">
                {club.extraInfo}
              </p>
            </div>
          </TiltCard>
        </section>

        {/* ──────────────────────────────────────────────────────────
            GLASS COORDINATORS
        ────────────────────────────────────────────────────────── */}
        {club.coordinators && club.coordinators.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center mb-16">
              <span className="mono-label text-[hsl(var(--phosphor))] tracking-widest uppercase text-xs mb-3">Leadership</span>
              <h2 className="display-m text-white uppercase tracking-tight">Core Team</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {club.coordinators.map((coord, idx) => {
                const linkedinUrl = formatLinkedIn(coord.linkedin);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease }}
                  >
                    <TiltCard className="h-full">
                      <div className="flex flex-col h-full p-6">
                        {/* Portrait */}
                        <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden mb-6 relative bg-white/5 border border-white/5">
                          {coord.image ? (
                            <img
                              src={coord.image}
                              alt={coord.name}
                              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[6rem] font-display font-black text-white/10 group-hover:text-[hsl(var(--phosphor))/0.3] transition-colors duration-500">
                                {initials(coord.name)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />
                          
                          {/* Role Badge floating on image */}
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white/90 text-[0.65rem] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                              {coord.role}
                            </span>
                            {linkedinUrl && (
                              <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-[hsl(var(--phosphor))] hover:border-[hsl(var(--phosphor))/0.5] transition-all"
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col flex-1 px-2">
                          <h3 className="text-2xl text-white font-medium mb-3 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                            {coord.name}
                          </h3>
                          {coord.bio && (
                            <p className="text-sm text-white/60 leading-relaxed font-light">
                              {coord.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────
            GLASS PROJECTS
        ────────────────────────────────────────────────────────── */}
        {club.projects && club.projects.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center mb-16">
              <span className="mono-label text-[hsl(var(--phosphor))] tracking-widest uppercase text-xs mb-3">Initiatives</span>
              <h2 className="display-m text-white uppercase tracking-tight">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {club.projects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, ease }}
                >
                  <div className="relative group bg-[#121212]/60 backdrop-blur-xl border border-white/5 hover:border-[hsl(var(--phosphor))/0.4] transition-colors duration-500 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center">
                    {/* Glow behind project */}
                    <div className="absolute top-1/2 -right-20 w-64 h-64 bg-[hsl(var(--phosphor))] opacity-0 group-hover:opacity-[0.08] blur-[80px] rounded-full transition-opacity duration-700 -translate-y-1/2 pointer-events-none" />

                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[hsl(var(--phosphor))/0.1] group-hover:border-[hsl(var(--phosphor))/0.3] transition-all duration-500">
                      <Code className="w-7 h-7 text-white/50 group-hover:text-[hsl(var(--phosphor))] transition-colors" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="display-s text-white uppercase tracking-tight leading-none m-0">
                          {proj.name}
                        </h3>
                        <span className="bg-white/5 border border-white/10 text-white/50 text-[0.6rem] uppercase tracking-widest px-3 py-1 rounded-full">
                          v1.0
                        </span>
                      </div>
                      <p className="text-lg text-white/70 leading-[1.6] font-light max-w-3xl">
                        {proj.description}
                      </p>
                    </div>

                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-3 bg-white/5 hover:bg-[hsl(var(--phosphor))/0.1] border border-white/10 hover:border-[hsl(var(--phosphor))/0.3] text-white/70 hover:text-[hsl(var(--phosphor))] px-6 py-4 rounded-2xl transition-all duration-300"
                      >
                        <Github className="w-5 h-5" />
                        <span className="mono-label text-xs tracking-widest">SOURCE</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────
            GLASS GALLERY
        ────────────────────────────────────────────────────────── */}
        {club.gallery && club.gallery.length > 0 && (
          <section>
            <div className="flex flex-col items-center text-center mb-16">
              <span className="mono-label text-[hsl(var(--phosphor))] tracking-widest uppercase text-xs mb-3">Archive</span>
              <h2 className="display-m text-white uppercase tracking-tight">Visual Gallery</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[300px] gap-4 sm:gap-6 grid-flow-dense">
              {club.gallery.map((imgUrl, idx) => {
                const isLarge = idx % 5 === 0;
                const isWide = idx % 7 === 0 && !isLarge;
                const isTall = idx % 3 === 0 && !isLarge && !isWide;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.6, delay: (idx % 4) * 0.1, ease }}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-white/5 border border-white/5 hover:border-[hsl(var(--phosphor))/0.4] transition-colors duration-500 ${
                      isLarge ? 'col-span-2 row-span-2' :
                      isWide ? 'col-span-2 row-span-1' :
                      isTall ? 'col-span-1 row-span-2' :
                      'col-span-1 row-span-1'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${club.name} gallery ${idx + 1}`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#121212]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pointer-events-none backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mb-3 scale-75 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="mono-label text-[0.65rem] tracking-[0.2em] text-white/90 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                        EXPAND
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ──────────────────────────────────────────────────────────
          LIGHTBOX
      ────────────────────────────────────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] bg-[#0A0A0A]/90 backdrop-blur-xl flex items-center justify-center p-6 sm:p-12"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden flex items-center justify-center">
            <img src={selectedImage} alt="Expanded preview" className="w-full h-full object-contain rounded-xl shadow-2xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-[hsl(var(--phosphor))/0.2] border border-white/20 hover:border-[hsl(var(--phosphor))] text-white hover:text-[hsl(var(--phosphor))] flex items-center justify-center transition-all backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ClubPage;
