import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const useAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => useAuth() }));

const renderGuard = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <p>Secret admin content</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('ProtectedRoute', () => {
  it('renders children for an authenticated user', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    renderGuard();

    expect(screen.getByText('Secret admin content')).toBeInTheDocument();
  });

  it('redirects an unauthenticated user to the login page', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    renderGuard();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret admin content')).not.toBeInTheDocument();
  });

  it('waits instead of redirecting while the session is still restoring', () => {
    // Redirecting during the async Firebase session restore would bounce an
    // already-signed-in admin back to /login on every refresh.
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    renderGuard();

    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    expect(screen.queryByText('Secret admin content')).not.toBeInTheDocument();
  });

  it('ignores a forged localStorage flag', () => {
    // The previous implementation trusted localStorage.cms_authenticated,
    // so setting it by hand granted full admin access. The guard must now
    // depend solely on the auth session, whatever storage claims.
    const store = new Map([['cms_authenticated', 'true']]);
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    });
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    renderGuard();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
