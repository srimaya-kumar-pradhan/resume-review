import { useContext } from 'react';
import { ProfileContext } from '../contexts/ProfileContext';

/**
 * Convenience hook to access the ProfileContext.
 * Must be called within a <ProfileProvider>.
 *
 * @returns {import('../contexts/ProfileContext').ProfileContextValue}
 * @throws {Error} If used outside of ProfileProvider
 *
 * @example
 *   const { profile, loading, saveProfile, isProfileComplete } = useProfile();
 */
export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      'useProfile must be used within a <ProfileProvider>. ' +
      'Wrap your component tree with <ProfileProvider>.'
    );
  }

  return context;
}
