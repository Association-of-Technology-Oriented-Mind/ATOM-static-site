import { z } from 'zod';

// Validation boundary for everything crossing into or out of the app:
// user input (registration forms) and external data (Firestore documents).

export const eventSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD'),
  time: z.string().optional(),
  location: z.string(),
  description: z.string(),
  image: z.string(),
  status: z.enum(['upcoming', 'past']),
  category: z.string(),
  participants: z.number().optional(),
  rating: z.number().optional(),
  registrationLink: z.string().optional(),
  eventType: z.enum(['free', 'paid']),
  gallery: z.array(z.string()).optional(),
});

export type EventInput = z.infer<typeof eventSchema>;

const phone = z
  .string()
  .trim()
  .transform(value => value.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'));

const baseRegistration = {
  name: z.string().trim().min(2, 'Name is required'),
  reg_no: z.string().trim().min(1, 'Registration number is required'),
  email: z.string().trim().email('Invalid email format'),
  phone_no: phone,
  year_of_study: z.string().trim().min(1, 'Year of study is required'),
  recipt_no: z.string().trim().min(1, 'Receipt number is required'),
};

export const internalRegistrationSchema = z.object({
  ...baseRegistration,
  division: z.string().trim().min(1, 'Division is required'),
});

export const externalRegistrationSchema = z.object({
  ...baseRegistration,
  dept_name: z.string().trim().min(1, 'Department is required'),
  college_name: z.string().trim().min(1, 'College name is required'),
});

export type InternalRegistration = z.infer<typeof internalRegistrationSchema>;
export type ExternalRegistration = z.infer<typeof externalRegistrationSchema>;
