'use client'

// src/app/signup/page.tsx

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PasswordStrength } from '@/components/PasswordStrength'

// ─── Types ───────────────────────────────────────────────────────────────────

type FieldErrors = Partial<Record<'username' | 'email' | 'password' | 'confirmPassword' | 'general', string>>

type FormState = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// ─── Client-side field validation (mirrors server rules for instant feedback) ─
// NOTE: The server always re-validates — these are for UX only.
function clientValidate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  // Username
  const u = form.username.trim()
  if (!u) errors.username = 'Username is required.'
  else if (u.length < 3) errors.username = 'Username must be at least 3 characters.'
  else if (u.length > 20) errors.username = 'Username must be 20 characters or fewer.'
  else if (!/^[a-zA-Z0-9_]+$/.test(u))
    errors.username = 'Only letters, numbers, and underscores allowed.'

  // Email
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = 'Please enter a valid email address.'

  // Password
  if (!form.password) errors.password = 'Password is required.'
  else {
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
    else if (!/\d/.test(form.password)) errors.password = 'Must contain at least one number.'
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password))
      errors.password = 'Must contain at least one special character.'
  }

  // Confirm password
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = 'Passwords do not match.'

  return errors
}

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  rightElement,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
  placeholder?: string
  rightElement?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-11 px-4 rounded-xl bg-white/60 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? 'border-red-400 focus:ring-red-300/50'
              : 'border-border focus:ring-primary/30 focus:border-primary/60'
          } ${rightElement ? 'pr-11' : ''}`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-red-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [createdUsername, setCreatedUsername] = useState('')

  const setField = useCallback((field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear the error for this field as the user types
    setFieldErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }, [])

  const handleSubmit = async () => {
    // 1. Client-side validation for instant feedback
    const clientErrors = clientValidate(form)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setStatus('loading')
    setFieldErrors({})

    try {
      // 2. Server-side validation via API route
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        // Map server errors back to field errors
        const serverErrors: FieldErrors = {}
        for (const err of data.errors ?? []) {
          serverErrors[err.field as keyof FieldErrors] = err.message
        }
        setFieldErrors(serverErrors)
        setStatus('idle')
        return
      }

      // 3. Success
      setCreatedUsername(data.user?.username ?? form.username)
      setStatus('success')

      // 4. Redirect to home after 2.5 s
      setTimeout(() => router.push('/dashboard'), 2500)
    } catch {
      setFieldErrors({ general: 'Could not reach the server. Please check your connection.' })
      setStatus('idle')
    }
  }

  // ─── Success screen ────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary flex items-center justify-center px-4">
        <motion.div
          className="text-center space-y-6 max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome, {createdUsername}!</h1>
            <p className="text-foreground/60 text-sm">
              Your account was created successfully. Redirecting you to the homepage…
            </p>
          </div>
          <div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
            />
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-primary hover:underline"
          >
            Go now →
          </button>
        </motion.div>
      </div>
    )
  }

  // ─── Sign-up form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="bg-white/60 backdrop-blur-md border border-border/60 rounded-3xl p-8 shadow-xl space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-2">
              <Rocket className="w-5 h-5" />
              LaunchFlow
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-foreground/60">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* General error */}
          <AnimatePresence>
            {fieldErrors.general && (
              <motion.div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {fieldErrors.general}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fields */}
          <div className="space-y-5">
            <Field
              label="Username"
              id="username"
              value={form.username}
              onChange={setField('username')}
              error={fieldErrors.username}
              autoComplete="username"
              placeholder="e.g. john_doe"
            />

            <Field
              label="Email address"
              id="email"
              type="email"
              value={form.email}
              onChange={setField('email')}
              error={fieldErrors.email}
              autoComplete="email"
              placeholder="you@example.com"
            />

            <div>
              <Field
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={setField('password')}
                error={fieldErrors.password}
                autoComplete="new-password"
                placeholder="Min. 8 chars, 1 number, 1 special"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <PasswordStrength password={form.password} />
            </div>

            <Field
              label="Confirm password"
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={setField('confirmPassword')}
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
              placeholder="Repeat your password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-semibold group"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-foreground/40">
            By signing up you agree to our{' '}
            <a href="#" className="underline hover:text-foreground/60">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-foreground/60">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  )
}