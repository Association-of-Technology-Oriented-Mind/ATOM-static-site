import { z } from 'zod';

// Validation boundary for everything crossing into or out of the app:
// user input (registration forms) and external data (Firestore documents).

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const eventSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  // Multi-day events were historically stored as "start,end" in one field.
  // Accept that form and split it, so those events don't silently disappear.
  date: z
    .string()
    .refine(
      value => value.split(',').every(part => ISO_DATE.test(part.trim())),
      'Expected YYYY-MM-DD, or "YYYY-MM-DD,YYYY-MM-DD" for multi-day events',
    )
    .transform(value => value.split(',')[0].trim()),
  endDate: z.string().regex(ISO_DATE).optional(),
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

export const clubCoordinatorSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  image: z.string().nullable().optional(),
  isMain: z.boolean().optional(),
  bio: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
});

export const clubProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  github: z.string().trim().optional(),
});

export const clubSchema = z.object({
  id: z.union([z.number(), z.string()]),
  slug: z.string().optional(),
  name: z.string().trim().min(1),
  icon: z.any().optional(),
  description: z.string().trim().min(1),
  objectives: z.string().trim().optional().default(''),
  extraInfo: z.string().trim().optional().default(''),
  coordinators: z.array(clubCoordinatorSchema),
  projects: z.array(clubProjectSchema).optional().default([]),
  gallery: z.array(z.string()).optional().default([]),
});

export type ClubInput = z.infer<typeof clubSchema>;
