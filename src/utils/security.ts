/**
 * Frontend Security & Sanitization Utilities
 * Protects against XSS attacks, malicious script injection, and automated form spam.
 */

// Basic HTML entity escaping for XSS prevention
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()
    // Strip script tags and event handlers
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/javascript:/gi, "")
    // Escape standard HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Strict email format validator
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// International phone number validator
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  // Allows optional +, spaces, hyphens, parentheses, and 7 to 18 digits
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,18}$/;
  return phoneRegex.test(phone.trim());
}

// Client-side submission cooldown to prevent spam bombing
const submissionTimestamps = new Map<string, number>();

export function checkSubmissionRateLimit(actionKey: string, cooldownMs: number = 3000): boolean {
  const now = Date.now();
  const lastTime = submissionTimestamps.get(actionKey) || 0;

  if (now - lastTime < cooldownMs) {
    return false; // Rate limited
  }

  submissionTimestamps.set(actionKey, now);
  return true; // Allowed
}
