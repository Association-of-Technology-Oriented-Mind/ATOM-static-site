import { describe, expect, it } from 'vitest';
import {
  eventSchema,
  externalRegistrationSchema,
  internalRegistrationSchema,
} from './schemas';

const validInternal = {
  name: 'Asha Kumar',
  reg_no: 'URK21CS1001',
  email: 'asha@karunya.edu.in',
  phone_no: '9876543210',
  year_of_study: '3',
  recipt_no: 'RCP-1042',
  division: 'A',
};

describe('internalRegistrationSchema', () => {
  it('accepts a complete valid submission', () => {
    // Arrange / Act
    const result = internalRegistrationSchema.safeParse(validInternal);

    // Assert
    expect(result.success).toBe(true);
  });

  it('strips spaces and dashes from phone numbers before validating', () => {
    const result = internalRegistrationSchema.safeParse({
      ...validInternal,
      phone_no: '98765-43210',
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone_no).toBe('9876543210');
  });

  it.each([
    ['9 digits', '987654321'],
    ['11 digits', '98765432101'],
    ['letters', 'nine876543'],
  ])('rejects a phone number with %s', (_label, phone_no) => {
    const result = internalRegistrationSchema.safeParse({ ...validInternal, phone_no });

    expect(result.success).toBe(false);
  });

  it('rejects a malformed email', () => {
    const result = internalRegistrationSchema.safeParse({
      ...validInternal,
      email: 'asha-at-karunya',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a blank name once trimmed', () => {
    const result = internalRegistrationSchema.safeParse({ ...validInternal, name: '   ' });

    expect(result.success).toBe(false);
  });

  it('requires division, which external registrations do not have', () => {
    const { division: _division, ...withoutDivision } = validInternal;

    const result = internalRegistrationSchema.safeParse(withoutDivision);

    expect(result.success).toBe(false);
  });
});

describe('externalRegistrationSchema', () => {
  const validExternal = {
    name: 'Ravi Menon',
    reg_no: 'EXT-2201',
    email: 'ravi@example.edu',
    phone_no: '9123456780',
    year_of_study: '2',
    recipt_no: 'RCP-2201',
    dept_name: 'Computer Science',
    college_name: 'Anna University',
  };

  it('accepts a complete valid submission', () => {
    const result = externalRegistrationSchema.safeParse(validExternal);

    expect(result.success).toBe(true);
  });

  it('requires college_name', () => {
    const { college_name: _college, ...withoutCollege } = validExternal;

    const result = externalRegistrationSchema.safeParse(withoutCollege);

    expect(result.success).toBe(false);
  });
});

describe('eventSchema', () => {
  const validEvent = {
    id: 1,
    title: 'Battle of Binaries 1.0',
    date: '2025-10-17',
    location: 'Karunya Institute',
    description: 'A CTF competition.',
    image: '/EVENTS/battle.webp',
    status: 'past',
    category: 'Competition',
    eventType: 'paid',
  };

  it('accepts a minimal valid event', () => {
    expect(eventSchema.safeParse(validEvent).success).toBe(true);
  });

  it('rejects a date that is not YYYY-MM-DD', () => {
    const result = eventSchema.safeParse({ ...validEvent, date: '17/10/2025' });

    expect(result.success).toBe(false);
  });

  it('accepts legacy "start,end" multi-day dates and keeps the start date', () => {
    // Two seeded events use this form; rejecting it would drop them silently.
    const result = eventSchema.safeParse({ ...validEvent, date: '2025-08-04,2025-08-08' });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.date).toBe('2025-08-04');
  });

  it('rejects an unknown status', () => {
    const result = eventSchema.safeParse({ ...validEvent, status: 'cancelled' });

    expect(result.success).toBe(false);
  });
});
