/**
 * Input sanitization utilities.
 * Strips HTML tags, entities, and dangerous content from user input.
 *
 * Client-side sanitization is for UX cleanliness.
 * Server-side sanitization in Cloud Functions is the security boundary.
 */

/**
 * Sanitizes a single string value.
 * Strips HTML tags, HTML entities, and trims whitespace.
 *
 * @param {*} input - Value to sanitize
 * @returns {string} Cleaned string
 */
export function sanitize(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<[^>]*>/g, '')        // Strip HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, '') // Strip HTML entities like &amp; &#39;
    .replace(/javascript:/gi, '')    // Remove javascript: protocol
    .replace(/on\w+=/gi, '')         // Remove inline event handlers
    .trim();
}

/**
 * Sanitizes an array of strings.
 * Applies sanitize() to each element and removes empty results.
 *
 * @param {*} arr - Array to sanitize
 * @returns {string[]} Cleaned array of non-empty strings
 */
export function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => sanitize(item))
    .filter((item) => item.length > 0);
}

/**
 * Sanitizes an entire profile object.
 * Applies appropriate sanitization to each field.
 *
 * @param {object} profile - Raw profile data from form
 * @returns {object} Sanitized profile data
 */
export function sanitizeProfile(profile) {
  return {
    name: sanitize(profile.name || ''),
    degree: sanitize(profile.degree || ''),
    yearOfStudy: sanitize(profile.yearOfStudy || ''),
    skills: sanitizeArray(profile.skills || []),
    interests: sanitizeArray(profile.interests || []),
    careerGoals: sanitize(profile.careerGoals || ''),
  };
}
