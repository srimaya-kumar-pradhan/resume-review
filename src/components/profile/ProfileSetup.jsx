import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { validateProfile } from '../../utils/validate';
import { sanitizeProfile } from '../../utils/sanitize';
import { YEAR_OPTIONS } from '../../utils/validate';
import TagInput from './TagInput';

/**
 * Profile setup wizard shown to new users or users editing their profile.
 * Collects: name, degree, yearOfStudy, skills, interests, careerGoals.
 * Validates client-side, sanitizes, then saves to Firestore.
 * Redirects to /dashboard on success.
 *
 * @returns {JSX.Element}
 */
export default function ProfileSetup() {
  const { user } = useAuth();
  const { profile, saveProfile } = useProfile();
  const navigate = useNavigate();

  /* Pre-fill form with existing profile data or Google account info */
  const [formData, setFormData] = useState({
    name: profile?.name || user?.displayName || '',
    degree: profile?.degree || '',
    yearOfStudy: profile?.yearOfStudy || '',
    skills: profile?.skills || [],
    interests: profile?.interests || [],
    careerGoals: profile?.careerGoals || '',
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /**
   * Updates a single form field value.
   * Clears the field's error when the user starts typing.
   *
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    /* Clear error for this field as the user types */
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /**
   * Handles form submission.
   * 1. Sanitize inputs
   * 2. Validate all fields
   * 3. Save to Firestore via ProfileContext
   * 4. Redirect to dashboard on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);

    /* Step 1: Sanitize */
    const sanitized = sanitizeProfile(formData);

    /* Step 2: Validate */
    const validationErrors = validateProfile(sanitized);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      /* Scroll to first error */
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    /* Step 3: Save */
    setIsSaving(true);
    try {
      await saveProfile(sanitized);
      /* Step 4: Redirect */
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSaveError('Failed to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">
            {profile ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
          <p className="text-text-light max-w-md mx-auto">
            Tell us about yourself so we can provide personalized career guidance powered by AI.
          </p>
        </div>

        {/* Profile photo from Google */}
        {user?.photoURL && (
          <div className="flex justify-center mb-6">
            <img
              src={user.photoURL}
              alt={user.displayName || 'Profile'}
              className="w-20 h-20 rounded-full border-4 border-primary/20 shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Save error banner */}
        {saveError && (
          <div
            className="mb-6 p-4 bg-danger-50 border border-danger/20 rounded-input text-danger text-sm animate-fade-in"
            role="alert"
          >
            {saveError}
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="bg-surface rounded-card shadow-lg shadow-primary/5 border border-gray-100 p-6 sm:p-8 space-y-6">
            {/* ─── Name ─── */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-text">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your full name"
                className={`w-full px-4 py-3 bg-surface border-2 rounded-input text-text placeholder:text-text-muted transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.name ? 'border-danger' : 'border-gray-200'}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-danger" role="alert">{errors.name}</p>
              )}
            </div>

            {/* ─── Degree ─── */}
            <div className="space-y-2">
              <label htmlFor="degree" className="block text-sm font-medium text-text">
                Degree / Program
              </label>
              <input
                id="degree"
                type="text"
                value={formData.degree}
                onChange={(e) => updateField('degree', e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className={`w-full px-4 py-3 bg-surface border-2 rounded-input text-text placeholder:text-text-muted transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.degree ? 'border-danger' : 'border-gray-200'}`}
                aria-invalid={!!errors.degree}
                aria-describedby={errors.degree ? 'degree-error' : undefined}
              />
              {errors.degree && (
                <p id="degree-error" className="text-sm text-danger" role="alert">{errors.degree}</p>
              )}
            </div>

            {/* ─── Year of Study ─── */}
            <div className="space-y-2">
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-text">
                Year of Study
              </label>
              <select
                id="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={(e) => updateField('yearOfStudy', e.target.value)}
                className={`w-full px-4 py-3 bg-surface border-2 rounded-input text-text transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${!formData.yearOfStudy ? 'text-text-muted' : ''} ${errors.yearOfStudy ? 'border-danger' : 'border-gray-200'}`}
                aria-invalid={!!errors.yearOfStudy}
                aria-describedby={errors.yearOfStudy ? 'year-error' : undefined}
              >
                <option value="" disabled>Select your year</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year} Year</option>
                ))}
              </select>
              {errors.yearOfStudy && (
                <p id="year-error" className="text-sm text-danger" role="alert">{errors.yearOfStudy}</p>
              )}
            </div>

            {/* ─── Skills ─── */}
            <TagInput
              label="Skills"
              id="skills"
              tags={formData.skills}
              onChange={(tags) => updateField('skills', tags)}
              error={errors.skills}
              maxTags={20}
              placeholder="e.g. JavaScript, Python, React..."
            />

            {/* ─── Interests ─── */}
            <TagInput
              label="Interests"
              id="interests"
              tags={formData.interests}
              onChange={(tags) => updateField('interests', tags)}
              error={errors.interests}
              maxTags={20}
              placeholder="e.g. AI/ML, Web Development, Data Science..."
            />

            {/* ─── Career Goals ─── */}
            <div className="space-y-2">
              <label htmlFor="careerGoals" className="block text-sm font-medium text-text">
                Career Goals
              </label>
              <textarea
                id="careerGoals"
                value={formData.careerGoals}
                onChange={(e) => updateField('careerGoals', e.target.value)}
                placeholder="Describe your career aspirations in 20–500 characters..."
                rows={4}
                className={`w-full px-4 py-3 bg-surface border-2 rounded-input text-text placeholder:text-text-muted transition-colors resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.careerGoals ? 'border-danger' : 'border-gray-200'}`}
                aria-invalid={!!errors.careerGoals}
                aria-describedby={errors.careerGoals ? 'goals-error' : 'goals-count'}
              />
              <div className="flex justify-between items-center">
                {errors.careerGoals ? (
                  <p id="goals-error" className="text-sm text-danger" role="alert">
                    {errors.careerGoals}
                  </p>
                ) : (
                  <span />
                )}
                <span
                  id="goals-count"
                  className={`text-xs ${formData.careerGoals.length > 500 ? 'text-danger' : formData.careerGoals.length >= 20 ? 'text-success' : 'text-text-muted'}`}
                >
                  {formData.careerGoals.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSaving}
            id="profile-submit-button"
            className="w-full py-4 bg-primary text-white font-semibold rounded-input hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {profile ? 'Update Profile' : 'Complete Setup'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
