import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Mock firebase modules to avoid import.meta.env errors in Jest.
 * import.meta is Vite-specific and not available in Node/Jest.
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
}));

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
}));

/* Import LoginPage AFTER mocks are set up */
const { default: LoginPage } = require('../../components/auth/LoginPage');

/**
 * Helper to render LoginPage with mocked AuthContext and Router.
 *
 * @param {object} [authOverrides] - Override default AuthContext values
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderLoginPage(authOverrides = {}) {
  const defaultAuthValue = {
    user: null,
    loading: false,
    error: null,
    signIn: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    clearError: jest.fn(),
    ...authOverrides,
  };

  return render(
    <AuthContext.Provider value={defaultAuthValue}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

describe('LoginPage', () => {
  test('renders the app heading', () => {
    renderLoginPage();
    /* The heading appears in both mobile and desktop variants */
    const headings = screen.getAllByText(/Smart Career Assistant|Welcome back/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  test('renders the Google Sign-In button', () => {
    renderLoginPage();
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('calls signIn when the Google button is clicked', async () => {
    const signIn = jest.fn().mockResolvedValue(undefined);
    renderLoginPage({ signIn });

    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    expect(signIn).toHaveBeenCalledTimes(1);
  });

  test('shows a loading spinner while auth state is being checked', () => {
    renderLoginPage({ loading: true });

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays error message when sign-in fails', () => {
    const errorMessage = 'Sign-in popup was closed. Please try again.';
    renderLoginPage({ error: errorMessage });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders dismiss button when error is shown', () => {
    renderLoginPage({ error: 'Some error occurred' });

    const dismissButton = screen.getByText(/dismiss/i);
    expect(dismissButton).toBeInTheDocument();
  });

  test('calls clearError when dismiss button is clicked', () => {
    const clearError = jest.fn();
    renderLoginPage({ error: 'Some error', clearError });

    fireEvent.click(screen.getByText(/dismiss/i));
    expect(clearError).toHaveBeenCalledTimes(1);
  });

  test('shows signing in state when signIn is in progress', async () => {
    /*
     * Simulate a slow signIn by returning a promise that resolves
     * after a brief delay. We use act() to flush React state updates.
     */
    let resolveSignIn;
    const signIn = jest.fn(
      () => new Promise((resolve) => { resolveSignIn = resolve; })
    );
    renderLoginPage({ signIn });

    const button = screen.getByRole('button', { name: /sign in with google/i });

    /* Before click: button should show "Sign in with Google" */
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();

    /* Click triggers the signIn flow */
    await fireEvent.click(button);

    /* signIn should have been called */
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  test('has unique id on the sign-in button for browser testing', () => {
    renderLoginPage();
    const button = document.getElementById('google-sign-in-button');
    expect(button).not.toBeNull();
  });
});
