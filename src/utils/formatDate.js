/**
 * Date formatting utilities for displaying Firestore timestamps.
 */

/**
 * Formats a Firestore timestamp or Date object into a readable string.
 *
 * @param {object|Date|null} timestamp - Firestore Timestamp or JS Date
 * @param {object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or 'N/A'
 */
export function formatDate(timestamp, options = {}) {
  if (!timestamp) return 'N/A';

  /* Convert Firestore Timestamp to Date if needed */
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  if (isNaN(date.getTime())) return 'N/A';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

/**
 * Formats a timestamp as a relative time string (e.g. "2 hours ago").
 *
 * @param {object|Date|null} timestamp
 * @returns {string} Relative time string or 'N/A'
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'N/A';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(timestamp);
}
