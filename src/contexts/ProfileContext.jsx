import { createContext, useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

/**
 * Profile context providing user profile state and update methods.
 *
 * @typedef {object} ProfileContextValue
 * @property {object|null} profile - User profile data from Firestore
 * @property {boolean} loading - True while fetching profile
 * @property {string|null} error - Last profile operation error
 * @property {(data: object) => Promise<void>} saveProfile - Create or update profile
 * @property {boolean} isProfileComplete - Whether the profile is fully filled out
 */
export const ProfileContext = createContext(null);

/**
 * Provides profile state and CRUD operations.
 * Fetches the user's profile from Firestore when auth state changes.
 * Exposes saveProfile() to create/update the /users/{uid} document.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch the user's profile document from Firestore.
   * Runs whenever the authenticated user changes.
   */
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;

        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() });
        } else {
          /* New user — no profile document yet */
          setProfile(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch profile:', err);
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  /**
   * Creates or updates the user's profile document in Firestore.
   * Sets profileComplete to true and manages timestamps.
   *
   * @param {object} profileData - Sanitized and validated profile fields
   * @throws {Error} If user is not authenticated
   */
  const saveProfile = useCallback(
    async (profileData) => {
      if (!user) throw new Error('Must be authenticated to save profile.');

      try {
        setError(null);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        const data = {
          ...profileData,
          email: user.email,
          photoURL: user.photoURL || '',
          profileComplete: true,
          updatedAt: serverTimestamp(),
        };

        if (docSnap.exists()) {
          await updateDoc(docRef, data);
        } else {
          /* First-time profile creation */
          data.createdAt = serverTimestamp();
          await setDoc(docRef, data);
        }

        setProfile({ id: user.uid, ...data });
      } catch (err) {
        console.error('Failed to save profile:', err);
        setError('Failed to save profile. Please try again.');
        throw err;
      }
    },
    [user]
  );

  /** Whether the current user has a fully completed profile */
  const isProfileComplete = Boolean(profile?.profileComplete);

  const value = {
    profile,
    loading,
    error,
    saveProfile,
    isProfileComplete,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
