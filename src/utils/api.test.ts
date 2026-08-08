import { beforeEach, describe, expect, it, vi } from 'vitest';

const addDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => addDoc(...args),
  collection: (_db: unknown, name: string) => ({ name }),
  serverTimestamp: () => 'SERVER_TIMESTAMP',
}));

vi.mock('@/lib/firebase', () => ({
  db: {},
  COLLECTIONS: { registrations: 'registrations' },
}));

const { registerParticipant } = await import('./api');

const validInternal = {
  name: 'Asha Kumar',
  reg_no: 'URK21CS1001',
  email: 'asha@karunya.edu.in',
  phone_no: '9876543210',
  year_of_study: '3',
  recipt_no: 'RCP-1042',
  division: 'A',
};

describe('registerParticipant', () => {
  beforeEach(() => {
    addDoc.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('writes a valid internal registration to Firestore', async () => {
    addDoc.mockResolvedValue({ id: 'doc-1' });

    const result = await registerParticipant(validInternal, 'internal');

    expect(result.success).toBe(true);
    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      name: 'Asha Kumar',
      type: 'internal',
      createdAt: 'SERVER_TIMESTAMP',
    });
  });

  it('rejects invalid input without touching Firestore', async () => {
    const result = await registerParticipant(
      { ...validInternal, phone_no: '123' },
      'internal',
    );

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/10 digits/);
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('reports failure when the Firestore write throws', async () => {
    // Regression: the old fetch-based version reported success even when the
    // request failed, so users saw a success screen for a lost registration.
    addDoc.mockRejectedValue(new Error('permission-denied'));

    const result = await registerParticipant(validInternal, 'internal');

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/atom@karunya\.edu/);
  });

  it('validates external registrations against the external schema', async () => {
    // Missing college_name, which only the external schema requires.
    const result = await registerParticipant(validInternal as never, 'external');

    expect(result.success).toBe(false);
    expect(addDoc).not.toHaveBeenCalled();
  });
});
