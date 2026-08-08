import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS, db } from '@/lib/firebase';
import {
  externalRegistrationSchema,
  internalRegistrationSchema,
  type ExternalRegistration,
  type InternalRegistration,
} from '@/lib/schemas';

// Registrations previously POSTed to api.atom.org.in, which no longer resolves
// (no DNS record) — every submission silently failed while still showing the
// user a success screen. They now land in Firestore.

export interface RegistrationResult {
  success: boolean;
  message: string;
}

export const registerParticipant = async (
  data: InternalRegistration | ExternalRegistration,
  type: 'internal' | 'external',
): Promise<RegistrationResult> => {
  const parsed =
    type === 'internal'
      ? internalRegistrationSchema.safeParse(data)
      : externalRegistrationSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid form data.' };
  }

  if (!db) {
    return {
      success: false,
      message: 'Registration is temporarily unavailable. Please contact atom@karunya.edu.',
    };
  }

  try {
    await addDoc(collection(db, COLLECTIONS.registrations), {
      ...parsed.data,
      type,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: 'Registration successful!' };
  } catch (error) {
    console.error('Registration failed:', error);
    return {
      success: false,
      message: 'Could not submit your registration. Please try again or email atom@karunya.edu.',
    };
  }
};
