import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Send, CheckCircle } from 'lucide-react';
import { registerParticipant } from '@/utils/api';
import { internalRegistrationSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';

const ease = [0.16, 1, 0.3, 1] as const;

interface FormData {
  name: string;
  reg_no: string;
  division: string;
  year_of_study: string;
  email: string;
  phone_no: string;
  recipt_no: string;
}

const InternalRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '', reg_no: '', division: '', year_of_study: '', email: '', phone_no: '', recipt_no: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const result = internalRegistrationSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Partial<FormData> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FormData;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const result = await registerParticipant(formData, 'internal');
    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      toast({
        title: 'Registration failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const goBack = () => window.history.back();

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--ink))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, hsl(var(--rule)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--rule)) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[hsl(var(--ink-raised))] border border-[hsl(var(--rule))] p-12 max-w-md w-full relative z-10"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
            <CheckCircle className="w-16 h-16 mx-auto mb-6" style={{ color: 'hsl(var(--phosphor))' }} />
          </motion.div>
          <h2 className="text-2xl mb-4 uppercase" style={{ fontFamily: 'var(--font-display)', color: 'hsl(var(--chalk))' }}>Registration Complete</h2>
          <p className="mb-8" style={{ fontFamily: 'var(--font-body)', color: 'hsl(var(--chalk)/0.6)' }}>
            You have been successfully registered for the event! Check your email for details and instructions.
          </p>
          <button onClick={() => window.location.href = '/events'} className="btn-tech w-full justify-center">
            Return to Events
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: 'hsl(var(--ink))' }}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, hsl(var(--rule)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--rule)) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-40 w-full flex items-center px-6 sm:px-10 lg:px-16 py-6 sm:py-8 border-b border-[hsl(var(--rule))] backdrop-blur-md">
        <button onClick={goBack} className="focus-phosphor flex items-center gap-2 group text-[hsl(var(--graphite))] hover:text-[hsl(var(--chalk))] transition-colors uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Event
        </button>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 flex-1 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-12 text-center">
          <span className="mono-label accent mb-4 inline-block">Internal Participant</span>
          <h1 className="uppercase" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'hsl(var(--chalk))', letterSpacing: '-0.02em' }}>
            Event Registration
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }} className="w-full max-w-2xl bg-[hsl(var(--ink-raised))] border border-[hsl(var(--rule))]">
          <div className="p-6 border-b border-[hsl(var(--rule))] bg-[hsl(var(--ink))]">
            <h2 className="uppercase flex items-center gap-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'hsl(var(--chalk))', letterSpacing: '0.1em' }}>
              <User className="w-4 h-4 text-[hsl(var(--phosphor))]" /> Student Information
            </h2>
          </div>
          
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
                  { id: 'reg_no', label: 'Registration No', type: 'text', placeholder: 'URK21XXXX' },
                  { id: 'division', label: 'Division', type: 'text', placeholder: 'Enter division' },
                  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'student@karunya.edu' },
                  { id: 'phone_no', label: 'Phone Number', type: 'tel', placeholder: '10-digit number' },
                  { id: 'recipt_no', label: 'Receipt Number', type: 'text', placeholder: 'Transaction receipt' }
                ].map(field => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="mono-label block text-[hsl(var(--graphite))]">
                      {field.label} <span className="text-[hsl(var(--phosphor))]">*</span>
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={formData[field.id as keyof FormData]}
                      onChange={handleInputChange}
                      className="w-full bg-[hsl(var(--ink))] border border-[hsl(var(--rule))] px-4 py-3 text-[hsl(var(--chalk))] placeholder:text-[hsl(var(--chalk)/0.3)] outline-none focus:border-[hsl(var(--phosphor))] transition-colors"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
                      placeholder={field.placeholder}
                    />
                    {errors[field.id as keyof FormData] && <p className="text-[#ff6b6b] text-xs mt-1" style={{ fontFamily: 'var(--font-body)' }}>{errors[field.id as keyof FormData]}</p>}
                  </div>
                ))}

                <div className="space-y-2">
                  <label htmlFor="year_of_study" className="mono-label block text-[hsl(var(--graphite))]">
                    Year of Study <span className="text-[hsl(var(--phosphor))]">*</span>
                  </label>
                  <select
                    id="year_of_study"
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleInputChange}
                    className="w-full bg-[hsl(var(--ink))] border border-[hsl(var(--rule))] px-4 py-3 text-[hsl(var(--chalk))] outline-none focus:border-[hsl(var(--phosphor))] transition-colors appearance-none"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                  {errors.year_of_study && <p className="text-[#ff6b6b] text-xs mt-1" style={{ fontFamily: 'var(--font-body)' }}>{errors.year_of_study}</p>}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[hsl(var(--rule))]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-tech w-full justify-center py-4"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">Processing<span className="animate-pulse">...</span></span>
                  ) : (
                    <span className="flex items-center gap-2">Submit Registration <Send className="w-4 h-4 ml-2" /></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InternalRegistrationForm;
