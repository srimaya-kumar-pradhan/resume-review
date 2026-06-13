import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ProfileContext } from '../../contexts/ProfileContext';

/**
 * Mock firebase modules to avoid import.meta.env errors in Jest.
 */
jest.mock('../../firebase', () => ({
  auth: {},
  googleProvider: { setCustomParameters: jest.fn() },
  db: {},
  functions: {},
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({ setCustomParameters: jest.fn() })),
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
}));

/* Import ProfileSetup AFTER mocks */
const { default: ProfileSetup } = require('../../components/profile/ProfileSetup');

/**
 * Renders ProfileSetup wrapped in required providers with mock values.
 *
 * @param {object} [overrides]
 * @param {object} [overrides.auth] - AuthContext overrides
 * @param {object} [overrides.profile] - ProfileContext overrides
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderProfileSetup(overrides = {}) {
  const authValue = {
    user: {
      uid: 'test-uid',
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: 'https://example.com/photo.jpg',
    },
    loading: false,
    error: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
    clearError: jest.fn(),
    ...overrides.auth,
  };

  const profileValue = {
    profile: null,
    loading: false,
    error: null,
    saveProfile: jest.fn().mockResolvedValue(undefined),
    isProfileComplete: false,
    ...overrides.profile,
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <ProfileContext.Provider value={profileValue}>
        <BrowserRouter>
          <ProfileSetup />
        </BrowserRouter>
      </ProfileContext.Provider>
    </AuthContext.Provider>
  );
}

describe('ProfileSetup', () => {
  test('renders the profile setup heading', () => {
    renderProfileSetup();
    expect(screen.getByText(/complete your profile/i)).toBeInTheDocument();
  });

  test('pre-fills name from Google account', () => {
    renderProfileSetup();
    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput.value).toBe('Test User');
  });

  test('renders all required form fields', () => {
    renderProfileSetup();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/degree/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year of study/i)).toBeInTheDocument();
    expect(screen.getByText(/career goals/i)).toBeInTheDocument();
  });

  test('renders year of study options', () => {
    renderProfileSetup();
    const select = screen.getByLabelText(/year of study/i);
    expect(select).toBeInTheDocument();
    /* Check that all year options are present */
    expect(screen.getByText(/1st Year/i)).toBeInTheDocument();
    expect(screen.getByText(/Postgrad Year/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    renderProfileSetup();
    const button = screen.getByRole('button', { name: /complete setup/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('shows validation errors when submitting empty form', () => {
    renderProfileSetup({
      auth: { user: { uid: 'test', displayName: '', email: '', photoURL: '' } },
    });

    /* Clear the pre-filled name */
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    /* Submit */
    fireEvent.click(screen.getByRole('button', { name: /complete setup/i }));

    /* Should show validation errors */
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  test('shows "Edit Your Profile" heading when profile exists', () => {
    renderProfileSetup({
      profile: {
        profile: {
          name: 'Existing User',
          degree: 'B.Tech',
          yearOfStudy: '3rd',
          skills: ['React'],
          interests: ['AI'],
          careerGoals: 'Become a senior engineer in 3 years with expertise.',
          profileComplete: true,
        },
        isProfileComplete: true,
      },
    });

    expect(screen.getByText(/edit your profile/i)).toBeInTheDocument();
  });

  test('renders the submit button with unique id', () => {
    renderProfileSetup();
    const button = document.getElementById('profile-submit-button');
    expect(button).not.toBeNull();
  });
});
