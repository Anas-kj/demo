'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type FieldErrors = Partial<Record<'email' | 'password' | 'general', string>>

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const clearError = useCallback((field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }, [])

  const handleSubmit = async () => {
    const errors: FieldErrors = {}
    if (!email.trim()) errors.email = 'Email is required.'
    if (!password) errors.password = 'Password is required.'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setStatus('loading')
    setFieldErrors({})

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        const serverErrors: FieldErrors = {}
        for (const err of data.errors ?? []) {
          serverErrors[err.field as keyof FieldErrors] = err.message
        }
        setFieldErrors(serverErrors)
        setStatus('idle')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setFieldErrors({ general: 'Could not reach the server. Please check your connection.' })
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/60 backdrop-blur-md border border-border/60 rounded-3xl p-8 shadow-xl space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-2">
              <Rocket className="w-5 h-5" />
              LaunchFlow
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-foreground/60">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

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

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError('email')
                }}
                aria-invalid={!!fieldErrors.email}
                className={`w-full h-11 px-4 rounded-xl bg-white/60 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.email
                    ? 'border-red-400 focus:ring-red-300/50'
                    : 'border-border focus:ring-primary/30 focus:border-primary/60'
                }`}
              />
              {fieldErrors.email && (
                <p role="alert" className="text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground/80">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearError('password')
                  }}
                  aria-invalid={!!fieldErrors.password}
                  className={`w-full h-11 px-4 pr-11 rounded-xl bg-white/60 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-200 ${
                    fieldErrors.password
                      ? 'border-red-400 focus:ring-red-300/50'
                      : 'border-border focus:ring-primary/30 focus:border-primary/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p role="alert" className="text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-semibold group"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}