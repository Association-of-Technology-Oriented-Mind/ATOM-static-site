import { Link, useNavigate } from 'react-router-dom';
import { Github, Mail, Instagram, Linkedin } from 'lucide-react';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Footer ────────────────────────────────────────────────────────────────────
// Elevated treatment with precision grid fade background.
// Verified facts only:
//   Email:   atom@karunya.edu
//   GitHub:  https://github.com/Association-of-Technology-Oriented-Mind/ATOM
//   Address: Karunya Institute of Technology and Sciences, Coimbatore
//   Live:    https://atom-2026.web.app
//
//   Live:    https://atom-2026.web.app

const ease = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/full-gallery' },
  { label: 'Clubs', to: '/#clubs-section' },
];

const CLUB_LINKS = [
  { label: 'Hack Hive', to: '/clubs/hackhive' },
  { label: 'DotDev', to: '/clubs/dotdev' },
  { label: 'Unbiased', to: '/clubs/unbias' },
  { label: 'Qyro', to: '/clubs/qyro' },
];

const SocialIcon = ({
  href,
  label,
  disabled = false,
  children,
}: {
  href: string;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  if (disabled) {
    return (
      <span
        className="footer-social__icon footer-social__icon--disabled"
        aria-label={label}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      className="footer-social__icon focus-phosphor"
      aria-label={label}
    >
      {children}
    </a>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer
      ref={ref}
      className="footer-section"
      aria-label="Site footer"
    >
      {/* Precision grid fade */}
      <div className="footer-grid-bg" aria-hidden="true" />

      <div className="footer-container">

        {/* Top grid */}
        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          {/* Identity column */}
          <div className="footer-identity">
            <p className="footer-wordmark">ATOM</p>
            <p className="footer-fullname">
              Association of Technology<br />Oriented Minds
            </p>
            <p className="footer-address">
              Karunya Institute of Technology and Sciences, Coimbatore
            </p>

            {/* Social icons */}
            <div className="footer-social">
              <SocialIcon
                href="https://github.com/Association-of-Technology-Oriented-Mind"
                label="ATOM GitHub repository"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </SocialIcon>

              {/* Instagram */}
              <SocialIcon
                href="https://instagram.com/atom-dscs"
                label="ATOM Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </SocialIcon>

              {/* LinkedIn */}
              <SocialIcon
                href="https://www.linkedin.com/company/atom-dscs/"
                label="ATOM LinkedIn"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </SocialIcon>

              <SocialIcon
                href="mailto:atom@karunya.edu"
                label="Email ATOM at atom@karunya.edu"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </SocialIcon>
            </div>
          </div>

          {/* Navigation column */}
          <div className="footer-col">
            <p className="footer-col__heading">Navigate</p>
            <ul className="footer-col__list">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label}>
                  {to.startsWith('/#') ? (
                    <button
                      className="footer-col__link focus-phosphor"
                      onClick={() => {
                        const id = to.replace('/#', '');
                        const el = document.getElementById(id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else navigate(to);
                      }}
                    >
                      {label}
                    </button>
                  ) : (
                    <Link to={to} className="footer-col__link focus-phosphor">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Clubs column */}
          <div className="footer-col">
            <p className="footer-col__heading">Clubs</p>
            <ul className="footer-col__list">
              {CLUB_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-col__link focus-phosphor">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="footer-col">
            <p className="footer-col__heading">Contact</p>
            <ul className="footer-col__list">
              <li>
                <a
                  href="mailto:atom@karunya.edu"
                  className="footer-col__link focus-phosphor"
                >
                  atom@karunya.edu
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Association-of-Technology-Oriented-Mind/ATOM/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-col__link focus-phosphor"
                >
                  GitHub Issues
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease }}
        >
          <p className="footer-bottom__copyright">
            © {new Date().getFullYear()} ATOM Club · Karunya Institute of Technology and Sciences
          </p>
          <p className="footer-bottom__tagline">
            Built by students, for students
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
