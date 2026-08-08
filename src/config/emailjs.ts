// EmailJS configuration for the contact form.
// Values come from .env (see .env.example). VITE_* vars are embedded in the
// client bundle — EmailJS public keys are designed to be client-side.
//
// Template variables: {{from_name}} {{from_email}} {{from_mobile}}
//                     {{to_email}} {{message}} {{reply_to}}
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
} as const;

export const isEmailJsConfigured = (): boolean =>
  Boolean(EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID && EMAILJS_CONFIG.PUBLIC_KEY);
