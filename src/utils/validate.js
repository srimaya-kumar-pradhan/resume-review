/**
 * Client-side input validation for all profile fields.
 * Every validator returns null on success or an error message string on failure.
 *
 * IMPORTANT: These are UX validations only. Server-side validation
 * in Cloud Functions is the security boundary (see functions/src/validators.js).
 */

/** Allowed values for the yearOfStudy field */
export const YEAR_OPTIONS = ['1st', '2nd', '3rd', '4th', 'Postgrad'];

/**
 * Checks whether a string contains HTML tags.
 *
 * @param {string} str - Input to check
 * @returns {boolean} True if HTML tags are found
 */
export function containsHTML(str) {
  return /<[^>]*>/g.test(str);
}

/**
 * Validates the name field.
 * Rules: required, string, 2–100 chars, no HTML.
 *
 * @param {*} name
 * @returns {string|null} Error message or null
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required.';
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';
  if (trimmed.length > 100) return 'Name must be 100 characters or less.';
  if (containsHTML(trimmed)) return 'Name must not contain HTML tags.';
  return null;
}

/**
 * Validates the degree field.
 * Rules: required, string, 2–100 chars, no HTML.
 *
 * @param {*} degree
 * @returns {string|null} Error message or null
 */
export function validateDegree(degree) {
  if (!degree || typeof degree !== 'string') return 'Degree is required.';
  const trimmed = degree.trim();
  if (trimmed.length < 2) return 'Degree must be at least 2 characters.';
  if (trimmed.length > 100) return 'Degree must be 100 characters or less.';
  if (containsHTML(trimmed)) return 'Degree must not contain HTML tags.';
  return null;
}

/**
 * Validates the yearOfStudy field.
 * Rules: required, must be one of the allowed enum values.
 *
 * @param {*} year
 * @returns {string|null} Error message or null
 */
export function validateYearOfStudy(year) {
  if (!year || typeof year !== 'string') return 'Year of study is required.';
  if (!YEAR_OPTIONS.includes(year)) {
    return `Year of study must be one of: ${YEAR_OPTIONS.join(', ')}.`;
  }
  return null;
}

/**
 * Validates a tag array (skills or interests).
 * Rules: required, array, min 1 item, each item 1–50 chars, no HTML.
 *
 * @param {*} tags - Array to validate
 * @param {string} fieldName - "Skills" or "Interests" for error messages
 * @returns {string|null} Error message or null
 */
export function validateTags(tags, fieldName) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return `At least one ${fieldName.toLowerCase()} is required.`;
  }

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (typeof tag !== 'string' || tag.trim().length === 0) {
      return `Each ${fieldName.toLowerCase()} must be a non-empty string.`;
    }
    if (tag.trim().length > 50) {
      return `Each ${fieldName.toLowerCase()} must be 50 characters or less.`;
    }
    if (containsHTML(tag)) {
      return `${fieldName} must not contain HTML tags.`;
    }
  }

  return null;
}

/**
 * Validates the careerGoals field.
 * Rules: required, string, 20–500 chars, no HTML.
 *
 * @param {*} goals
 * @returns {string|null} Error message or null
 */
export function validateCareerGoals(goals) {
  if (!goals || typeof goals !== 'string') return 'Career goals are required.';
  const trimmed = goals.trim();
  if (trimmed.length < 20) return 'Career goals must be at least 20 characters.';
  if (trimmed.length > 500) return 'Career goals must be 500 characters or less.';
  if (containsHTML(trimmed)) return 'Career goals must not contain HTML tags.';
  return null;
}

/**
 * Validates resume text for the Resume Review feature.
 * Rules: required, string, 100–5000 chars.
 *
 * @param {*} text
 * @returns {string|null} Error message or null
 */
export function validateResumeText(text) {
  if (!text || typeof text !== 'string') return 'Resume text is required.';
  const trimmed = text.trim();
  if (trimmed.length < 100) return 'Resume text must be at least 100 characters.';
  if (trimmed.length > 5000) return 'Resume text must be 5000 characters or less.';
  return null;
}

/**
 * Validates an entire profile object.
 * Returns an object with field names as keys and error messages as values.
 * An empty object means all fields are valid.
 *
 * @param {object} profile - The profile data to validate
 * @returns {object} Errors object: { fieldName: errorMessage }
 */
export function validateProfile(profile) {
  const errors = {};

  const nameError = validateName(profile.name);
  if (nameError) errors.name = nameError;

  const degreeError = validateDegree(profile.degree);
  if (degreeError) errors.degree = degreeError;

  const yearError = validateYearOfStudy(profile.yearOfStudy);
  if (yearError) errors.yearOfStudy = yearError;

  const skillsError = validateTags(profile.skills, 'Skills');
  if (skillsError) errors.skills = skillsError;

  const interestsError = validateTags(profile.interests, 'Interests');
  if (interestsError) errors.interests = interestsError;

  const goalsError = validateCareerGoals(profile.careerGoals);
  if (goalsError) errors.careerGoals = goalsError;

  return errors;
}
