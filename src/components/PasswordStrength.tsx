'use client'

// src/components/PasswordStrength.tsx

type Props = {
  password: string
}

type Rule = {
  label: string
  met: boolean
}

export function PasswordStrength({ password }: Props) {
  const rules: Rule[] = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains a special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ]

  const metCount = rules.filter((r) => r.met).length
  const strength = metCount === 0 ? null : metCount === 1 ? 'weak' : metCount === 2 ? 'fair' : 'strong'

  const barColor =
    strength === 'weak' ? 'bg-red-500' : strength === 'fair' ? 'bg-yellow-500' : 'bg-green-500'

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= metCount ? barColor : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Rule checklist */}
      <ul className="space-y-1">
        {rules.map((rule) => (
          <li key={rule.label} className="flex items-center gap-2 text-xs">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-200 ${
                rule.met
                  ? 'bg-green-100 text-green-600'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {rule.met ? '✓' : '·'}
            </span>
            <span className={rule.met ? 'text-foreground/70' : 'text-muted-foreground'}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}