import { createContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

/**
 * Authentication context providing user state and auth methods.
 *
 * @typedef {object} AuthContextValue
 * @property {import('firebase/auth').User|null} user - Current Firebase user or null
 * @property {boolean} loading - True while checking initial auth state
 * @property {string|null} error - Last auth error message or null
 * @property {() => Promise<void>} signIn - Triggers Google Sign-In popup
 * @property {() => Promise<void>} signOut - Signs the user out
 * @property {() => void} clearError - Clears the current error
 */
export const AuthContext = createContext(null);

/**
 * Provides authentication state to the entire app.
 * Listens for Firebase auth state changes and exposes
 * signIn/signOut methods via context.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Listen for auth state changes (login, logout, token refresh) */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (authError) => {
        console.error('Auth state error:', authError);
        setError(authError.message);
        setLoading(false);
      }
    );

    /* Cleanup subscription on unmount */
    return unsubscribe;
  }, []);

  /**
   * Opens Google Sign-In popup.
   * On success, onAuthStateChanged fires and updates user state.
   * On failure, sets the error state.
   */
  const signIn = useCallback(async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      /* Handle specific Firebase auth errors with user-friendly messages */
      const message =
        err.code === 'auth/popup-closed-by-user'
          ? 'Sign-in popup was closed. Please try again.'
          : err.code === 'auth/network-request-failed'
            ? 'Network error. Please check your connection.'
            : err.message || 'Sign-in failed. Please try again.';

      setError(message);
    }
  }, []);

  /**
   * Signs the current user out.
   * On success, onAuthStateChanged fires and clears user state.
   */
  const signOut = useCallback(async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err.message || 'Sign-out failed.');
    }
  }, []);

  /** Clears the current error message */
  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
