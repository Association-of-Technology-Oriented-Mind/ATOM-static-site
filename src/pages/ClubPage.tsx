import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Linkedin, Target, Users, Code, Image as ImageIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { hackhiveClub } from '@/constants/hackhive';
import { dotdevClub } from '@/constants/dotdev';
import { unbiasClub } from '@/constants/unbias';
import { rndClub } from '@/constants/rnd';
import { careerGuidanceClub } from '@/constants/career-guidance';

const ease = [0.16, 1, 0.3, 1] as const;

const getClubData = (slug?: string) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  if (s === 'hackhive') return hackhiveClub;
  if (s === 'dotdev') return dotdevClub;
  if (s === 'unbias' || s === 'unbiased') return unbiasClub;
  if (s === 'qyro' || s === 'rnd') return { ...rndClub, name: s === 'qyro' ? 'Qyro Club' : rndClub.name };
  if (s === 'career-guidance') return careerGuidanceClub;
  return null;
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

const ClubPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const club = getClubData(slug);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

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
            The club dossier you are looking for does not exist or has been relocated.
          </p>
          <button 
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/#clubs-section');
              }
            }} 
            className="btn-tech inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Clubs</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--ink))] relative">
      <Navigation />

      {/* Hero / Header Section */}
      <header className="relative pt-36 pb-20 border-b border-[hsl(var(--rule))] overflow-hidden lattice">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[600px] pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--phosphor)) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/#clubs-section');
              }
            }}
            className="inline-flex items-center gap-2 mono-label text-[hsl(var(--graphite))] hover:text-[hsl(var(--phosphor))] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO SUB-CLUBS</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="mono-label text-[hsl(var(--phosphor))] uppercase">DOSSIER // 01</span>
                <div className="h-px w-8 bg-[hsl(var(--rule))]" />
                <span className="mono-label text-[hsl(var(--graphite))] uppercase">{slug?.toUpperCase()}</span>
              </div>
              
              <h1 className="display-xl text-[hsl(var(--chalk))] uppercase mb-6">
                {club.name}
              </h1>

              <p className="editorial-body text-[hsl(var(--chalk)/0.8)] text-lg sm:text-xl leading-relaxed">
                {club.description}
              </p>
            </div>

            {club.icon && typeof club.icon === 'string' && (
              <div className="w-24 h-24 sm:w-32 sm:h-32 p-4 border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))] flex items-center justify-center shrink-0">
                <img src={club.icon} alt={`${club.name} icon`} className="w-full h-full object-contain" />
              </div>
            )}
          </motion.div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Mission Objectives & Extra Info */}
        <section className="py-20 border-b border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised)/0.4)]">
          <div className="max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="border border-[hsl(var(--rule))] p-8 sm:p-10 bg-[hsl(var(--ink))] relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-[hsl(var(--phosphor))]" />
                <h2 className="mono-label text-base text-[hsl(var(--chalk))] uppercase">Mission Objectives</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[hsl(var(--chalk)/0.75)]">
                {club.objectives}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="border border-[hsl(var(--rule))] p-8 sm:p-10 bg-[hsl(var(--ink))] relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-5 h-5 text-[hsl(var(--phosphor))]" />
                <h2 className="mono-label text-base text-[hsl(var(--chalk))] uppercase">Impact & Scope</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[hsl(var(--chalk)/0.75)]">
                {club.extraInfo}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coordinators & Educators */}
        {club.coordinators && club.coordinators.length > 0 && (
          <section className="py-24 border-b border-[hsl(var(--rule))]">
            <div className="max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16">
              <div className="flex items-center gap-4 mb-12">
                <Users className="w-5 h-5 text-[hsl(var(--phosphor))]" />
                <h2 className="display-m text-[hsl(var(--chalk))] uppercase">Coordinators & Educators</h2>
                <div className="flex-1 h-px bg-[hsl(var(--rule))]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {club.coordinators.map((coord, idx) => {
                  const linkedinUrl = formatLinkedIn(coord.linkedin);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08, ease }}
                      className="border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))] p-6 flex flex-col justify-between hover:border-[hsl(var(--phosphor)/0.4)] transition-colors group"
                    >
                      <div>
                        <div className="w-20 h-20 border border-[hsl(var(--rule))] overflow-hidden bg-[hsl(var(--ink))] mb-6 flex items-center justify-center">
                          {coord.image ? (
                            <img
                              src={coord.image}
                              alt={coord.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <span className="mono-label text-xl text-[hsl(var(--graphite))]">
                              {initials(coord.name)}
                            </span>
                          )}
                        </div>

                        <span className="mono-label text-[0.625rem] text-[hsl(var(--phosphor))] uppercase tracking-widest block mb-1">
                          {coord.role}
                        </span>
                        <h3 className="font-mono text-lg text-[hsl(var(--chalk))] font-bold mb-3">
                          {coord.name}
                        </h3>

                        {coord.bio && (
                          <p className="text-xs text-[hsl(var(--chalk)/0.65)] leading-relaxed mb-6">
                            {coord.bio}
                          </p>
                        )}
                      </div>

                      {linkedinUrl && (
                        <a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono-label text-xs text-[hsl(var(--graphite))] hover:text-[hsl(var(--phosphor))] transition-colors inline-flex items-center gap-2 mt-auto"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>CONNECT ON LINKEDIN</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {club.projects && club.projects.length > 0 && (
          <section className="py-24 border-b border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised)/0.2)]">
            <div className="max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16">
              <div className="flex items-center gap-4 mb-12">
                <Github className="w-5 h-5 text-[hsl(var(--phosphor))]" />
                <h2 className="display-m text-[hsl(var(--chalk))] uppercase">Featured Repositories & Projects</h2>
                <div className="flex-1 h-px bg-[hsl(var(--rule))]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {club.projects.map((proj, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease }}
                    className="border border-[hsl(var(--rule))] bg-[hsl(var(--ink))] p-6 flex flex-col justify-between hover:border-[hsl(var(--phosphor))] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="mono-label text-[0.625rem] text-[hsl(var(--phosphor))]">
                          PROJECT // 0{idx + 1}
                        </span>
                        <Github className="w-4 h-4 text-[hsl(var(--graphite))]" />
                      </div>
                      <h3 className="font-mono text-base text-[hsl(var(--chalk))] font-bold mb-2">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-[hsl(var(--chalk)/0.65)] leading-relaxed mb-6">
                        {proj.description}
                      </p>
                    </div>

                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tech text-xs inline-flex items-center gap-2 py-2 px-4 border border-[hsl(var(--rule))] hover:border-[hsl(var(--phosphor))]"
                    >
                      <span>VIEW SOURCE</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Club Gallery */}
        {club.gallery && club.gallery.length > 0 && (
          <section className="py-24">
            <div className="max-w-[var(--container-xl)] mx-auto px-6 sm:px-10 lg:px-16">
              <div className="flex items-center gap-4 mb-12">
                <ImageIcon className="w-5 h-5 text-[hsl(var(--phosphor))]" />
                <h2 className="display-m text-[hsl(var(--chalk))] uppercase">Gallery & Activity Stream</h2>
                <div className="flex-1 h-px bg-[hsl(var(--rule))]" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {club.gallery.map((imgUrl, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 4) * 0.05, ease }}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="group relative cursor-pointer aspect-video sm:aspect-square overflow-hidden border border-[hsl(var(--rule))] bg-[hsl(var(--ink-raised))]"
                  >
                    <img
                      src={imgUrl}
                      alt={`${club.name} activity ${idx + 1}`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="mono-label text-xs text-[hsl(var(--chalk))] border border-[hsl(var(--chalk)/0.5)] px-3 py-1 bg-black/60">
                        EXPAND
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden border border-[hsl(var(--rule))]">
            <img src={selectedImage} alt="Expanded preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 mono-label text-xs text-white bg-black/80 px-4 py-2 border border-white/20 hover:border-[hsl(var(--phosphor))]"
            >
              CLOSE [ESC]
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ClubPage;
