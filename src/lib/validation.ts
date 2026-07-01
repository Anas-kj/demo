
export type ValidationError = {
  field: string
  message: string
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: ValidationError[] }

// ─── Username ────────────────────────────────────────────────────────────────
// Rules: required, 3–20 chars, alphanumeric + underscores only
export function validateUsername(username: unknown): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof username !== 'string' || username.trim() === '') {
    errors.push({ field: 'username', message: 'Username is required.' })
    return errors
  }
  const u = username.trim()
  if (u.length < 3) errors.push({ field: 'username', message: 'Username must be at least 3 characters.' })
  if (u.length > 20) errors.push({ field: 'username', message: 'Username must be 20 characters or fewer.' })
  if (!/^[a-zA-Z0-9_]+$/.test(u))
    errors.push({ field: 'username', message: 'Username may only contain letters, numbers, and underscores.' })
  return errors
}

// ─── Email ───────────────────────────────────────────────────────────────────
export function validateEmail(email: unknown): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required.' })
    return errors
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim()))
    errors.push({ field: 'email', message: 'Please enter a valid email address.' })
  return errors
}

// ─── Password ────────────────────────────────────────────────────────────────
// Rules: ≥8 chars, at least 1 number, at least 1 special character
export function validatePassword(password: unknown): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof password !== 'string' || password === '') {
    errors.push({ field: 'password', message: 'Password is required.' })
    return errors
  }
  if (password.length < 8)
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' })
  if (!/\d/.test(password))
    errors.push({ field: 'password', message: 'Password must contain at least one number.' })
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push({ field: 'password', message: 'Password must contain at least one special character.' })
  return errors
}

// ─── Confirm Password ────────────────────────────────────────────────────────
export function validateConfirmPassword(
  password: unknown,
  confirmPassword: unknown
): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof confirmPassword !== 'string' || confirmPassword === '') {
    errors.push({ field: 'confirmPassword', message: 'Please confirm your password.' })
    return errors
  }
  if (password.trim() !== confirmPassword.trim())
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' })
  return errors
}

// ─── Full signup payload validator ───────────────────────────────────────────
export function validateSignupPayload(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, errors: [{ field: 'general', message: 'Invalid request body.' }] }
  }

  const { username, email, password, confirmPassword } = body as Record<string, unknown>

  const errors: ValidationError[] = [
    ...validateUsername(username),
    ...validateEmail(email),
    ...validatePassword(password),
    ...validateConfirmPassword(password, confirmPassword),
  ]

  return errors.length === 0 ? { ok: true } : { ok: false, errors }
}