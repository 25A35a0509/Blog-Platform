/**
 * Formats an ISO date string into a short, readable date (e.g. "Jun 14, 2026").
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats an ISO date string into a relative "time ago" string for comments.
 */
export const timeAgo = (isoString) => {
  if (!isoString) return '';
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];

  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

/**
 * Strips HTML tags from a string, useful for plain-text previews.
 */
export const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Estimates reading time in minutes based on ~200 words per minute.
 */
export const getReadingTime = (html = '') => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/**
 * Deterministically maps a category name to one of a fixed set of accent
 * colors, used for the colored "spine" on post cards.
 */
const CATEGORY_COLORS = [
  'bg-primary-500',
  'bg-accent-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-sky-500',
  'bg-violet-500',
];

export const getCategoryColor = (category = '') => {
  let hash = 0;
  for (let i = 0; i < category.length; i += 1) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
};

/**
 * Returns initials (1-2 letters) for a display name, used in avatar fallbacks.
 */
export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
