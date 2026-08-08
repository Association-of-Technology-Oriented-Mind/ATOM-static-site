import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Send, AlertCircle, User, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailJsConfigured } from '@/config/emailjs';

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = { name: "", mobile: "", email: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!isEmailJsConfigured()) {
      toast({
        title: "Contact form unavailable",
        description: "Please email us directly at atom@karunya.edu",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_mobile: formData.mobile,
        to_email: 'atom@karunya.edu',
        message: `
Contact Form Submission from ATOM Club Website

Name: ${formData.name}
Email: ${formData.email}
Mobile: ${formData.mobile}

This person is interested in joining the ATOM Club community.
        `.trim(),
        reply_to: formData.email,
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for your interest. We'll get back to you at atom@karunya.edu soon.",
        variant: "default",
      });

      setFormData({ name: "", mobile: "", email: "" });
      setErrors({ name: "", mobile: "", email: "" });
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: "Error Sending Message",
        description: "Something went wrong. Please try emailing us directly at atom@karunya.edu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <section
      ref={ref}
      className="min-h-screen relative py-8 px-4 sm:py-12 sm:px-6 md:py-16 lg:py-20 max-w-5xl mx-auto overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-blue-500/3 via-purple-500/3 to-cyan-500/3 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8 sm:mb-12 lg:mb-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
        >
          Contact Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg lg:text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 px-4"
        >
          Get in touch with the ATOM Club to learn more about our programs, events, and opportunities at Karunya Institute of Technology and Sciences.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-base text-foreground-secondary max-w-2xl mx-auto"
        >
          We look forward to connecting with you
        </motion.p>
      </motion.div>

      {/* Unified Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Main Form Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          {/* Enhanced glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl blur opacity-50" />

          <div className="relative glass-card rounded-3xl border border-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="relative px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10">
              <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-4"
                >
                  <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
                >
                  Contact Information
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-sm sm:text-base text-foreground-secondary max-w-2xl mx-auto"
                >
                  Please provide your details below and we'll get back to you promptly.
                </motion.p>
              </div>
            </div>

            {/* Form Fields Container */}
            <div className="px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10">
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">

                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                    >
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </motion.div>
                    <div className="flex-1">
                      <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-foreground mb-1">
                        Full Name *
                      </label>
                        <p className="text-xs sm:text-sm text-foreground-secondary">
                          Please enter your full name
                        </p>
                    </div>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border-2 rounded-xl text-base sm:text-lg focus:outline-none transition-all duration-300 placeholder-foreground/50 ${
                      errors.name
                        ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/30"
                        : "border-white/20 hover:border-white/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10"
                    }`}
                    placeholder="Enter your full name"
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-green-500/30 group-hover:to-teal-500/30 transition-all duration-300"
                    >
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    </motion.div>
                    <div className="flex-1">
                      <label htmlFor="mobile" className="block text-sm sm:text-base font-semibold text-foreground mb-1">
                        Phone Number *
                      </label>
                      <p className="text-xs sm:text-sm text-foreground-secondary">
                        Please provide your contact number
                      </p>
                    </div>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border-2 rounded-xl text-base sm:text-lg focus:outline-none transition-all duration-300 placeholder-foreground/50 ${
                      errors.mobile
                        ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/30"
                        : "border-white/20 hover:border-white/30 focus:border-green-400/50 focus:ring-4 focus:ring-green-400/10"
                    }`}
                    placeholder="+91 Your phone number..."
                  />
                  <AnimatePresence>
                    {errors.mobile && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.mobile}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300"
                    >
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </motion.div>
                    <div className="flex-1">
                      <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-foreground mb-1">
                        Email Address *
                      </label>
                      <p className="text-xs sm:text-sm text-foreground-secondary">
                        Your primary email address
                      </p>
                    </div>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border-2 rounded-xl text-base sm:text-lg focus:outline-none transition-all duration-300 placeholder-foreground/50 ${
                      errors.email
                        ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/30"
                        : "border-white/20 hover:border-white/30 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-400/10"
                    }`}
                    placeholder="your@email.com"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative pt-4"
                >
                  {/* Enhanced background glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 via-cyan-500/15 to-blue-500/15 rounded-2xl blur-3xl"
                  />

                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full relative overflow-hidden glass-card p-6 sm:p-8 rounded-2xl border-2 border-blue-400/40 bg-gradient-to-r from-blue-500/25 via-purple-500/25 via-cyan-500/25 to-blue-500/25 hover:border-blue-400/60 hover:bg-gradient-to-r hover:from-blue-500/35 hover:via-purple-500/35 hover:via-cyan-500/35 hover:to-blue-500/35 transition-all duration-500 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/0 via-cyan-400/0 to-blue-400/0 group-hover:from-blue-400/25 group-hover:via-purple-400/25 group-hover:via-cyan-400/25 group-hover:to-blue-400/25 transition-all duration-500 rounded-2xl" />

                    <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/70 border-t-transparent rounded-full"
                          />
                          <span className="text-lg sm:text-xl font-bold text-white">
                            Sending your message...
                          </span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          >
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </motion.div>
                          <span className="text-lg sm:text-xl font-bold text-white">
                            Submit Inquiry
                          </span>
                          <motion.div
                            animate={{ x: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          >
                            <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </motion.div>
                        </>
                      )}
                    </div>


                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Contact Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8"
      >
        {/* Email Info */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass-card p-4 sm:p-6 rounded-2xl text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
          >
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </motion.div>
          <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-2">Email Us</h3>
          <p className="text-xs sm:text-sm text-foreground-secondary">
            atom@karunya.edu
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass-card p-4 sm:p-6 rounded-2xl text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
          >
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          </motion.div>
          <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-2">Why Choose Us?</h3>
          <p className="text-xs sm:text-sm text-foreground-secondary">
            Join an innovative community of creators and leaders
          </p>
        </motion.div>
      </motion.div>

      {/* Footer Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center py-6 sm:py-8"
      >
        <div className="text-sm sm:text-base text-foreground-secondary">
          Developed for the ATOM Club community at Karunya Institute of Technology and Sciences
        </div>
      </motion.div>

    </section>
  );
};
