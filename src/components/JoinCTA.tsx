import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Send, AlertCircle, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailJsConfigured } from '@/config/emailjs';

// ── Join / Contact CTA ────────────────────────────────────────────────────────
// Premium composition with editorial heading.
// Full email: atom@karunya.edu
// EmailJS logic preserved exactly from the original Contact.tsx.

const ease = [0.16, 1, 0.3, 1] as const;

export const JoinCTA = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({ name: '', mobile: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = { name: '', mobile: '', email: '' };
    if (!formData.name.trim() || formData.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';
    if (!formData.mobile.trim() || !/^\+?[\d\s\-()]+$/.test(formData.mobile.trim()))
      e.mobile = 'Please enter a valid mobile number';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      e.email = 'Please enter a valid email address';
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fix the errors and try again.', variant: 'destructive' });
      return;
    }
    if (!isEmailJsConfigured()) {
      toast({
        title: 'Contact form unavailable',
        description: 'Please email us directly at atom@karunya.edu',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          from_mobile: formData.mobile,
          to_email: 'atom@karunya.edu',
          message: `Join inquiry from ATOM website\n\nName: ${formData.name}\nEmail: ${formData.email}\nMobile: ${formData.mobile}`,
          reply_to: formData.email,
        },
        EMAILJS_CONFIG.PUBLIC_KEY,
      );
      toast({ title: 'Message Sent!', description: "We'll get back to you at atom@karunya.edu soon." });
      setFormData({ name: '', mobile: '', email: '' });
      setErrors({ name: '', mobile: '', email: '' });
    } catch (err) {
      console.error('EmailJS Error:', err);
      toast({
        title: 'Error Sending Message',
        description: 'Something went wrong. Please email us at atom@karunya.edu',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (
    id: keyof typeof formData,
    label: string,
    type: string,
    placeholder: string,
    Icon: typeof User,
  ) => (
    <div className="join-field">
      <label htmlFor={id} className="join-field__label">
        {label}
      </label>
      <div className="join-field__input-wrapper">
        <Icon
          className="join-field__icon"
          aria-hidden="true"
        />
        <input
          id={id}
          type={type}
          value={formData[id]}
          onChange={ev => {
            setFormData(p => ({ ...p, [id]: ev.target.value }));
            if (errors[id]) setErrors(p => ({ ...p, [id]: '' }));
          }}
          placeholder={placeholder}
          className="join-field__input focus-phosphor"
          style={{
            borderColor: errors[id]
              ? 'hsl(0, 72%, 58%, 0.5)'
              : 'hsl(var(--rule))',
          }}
        />
      </div>
      <AnimatePresence>
        {errors[id] && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="join-field__error"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {errors[id]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section
      id="join-section"
      ref={ref}
      className="join-section"
      aria-labelledby="join-heading"
    >
      <div className="join-container">
        <div className="join-grid">

          {/* Left — copy */}
          <motion.div
            className="join-copy"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            <div className="join-label">
              <span className="join-label__num">06</span>
              <span className="join-label__rule" aria-hidden="true" />
              Join
            </div>

            <h2 id="join-heading" className="join-heading">
              Join the<br />
              <span className="join-heading__accent">network</span>
            </h2>
            <p className="join-body">
              Get in touch with the ATOM Club to learn more about our programs, events, and
              opportunities at Karunya Institute of Technology and Sciences.
            </p>

            <div className="join-email">
              <div className="join-email__icon">
                <Mail className="w-3.5 h-3.5" style={{ color: 'hsl(var(--phosphor))' }} aria-hidden="true" />
              </div>
              <a
                href="mailto:atom@karunya.edu"
                className="join-email__link focus-phosphor"
              >
                atom@karunya.edu
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.form
            onSubmit={handleSubmit}
            className="join-form"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease }}
            noValidate
          >
            {field('name', 'Full name *', 'text', 'Your full name', User)}
            {field('mobile', 'Phone number *', 'tel', '+91 your number', Phone)}
            {field('email', 'Email address *', 'email', 'your@email.com', Mail)}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-tech join-submit"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <span>Submit inquiry</span>
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
