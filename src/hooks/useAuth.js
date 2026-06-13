import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Convenience hook to access the AuthContext.
 * Must be called within an <AuthProvider>.
 *
 * @returns {import('../contexts/AuthContext').AuthContextValue}
 * @throws {Error} If used outside of AuthProvider
 *
 * @example
 *   const { user, loading, signIn, signOut } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an <AuthProvider>. ' +
      'Wrap your component tree with <AuthProvider>.'
    );
  }

  return context;
}
