/**
 * Formats a name as initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Masks an email for display (e.g. a***@example.com)
 */
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  return `${user[0]}***@${domain}`;
}

/**
 * Generates a simple random ID string
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}
// add: capitalizeWords helper
