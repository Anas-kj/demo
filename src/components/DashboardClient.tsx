'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Rocket,
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  Plus,
  MoreHorizontal,
  LogOut,
} from 'lucide-react'

type User = { id: string; name: string; email: string }

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Users, label: 'Team' },
  { icon: CreditCard, label: 'Billing' },
  { icon: Settings, label: 'Settings' },
]

const stats = [
  { label: 'Active Projects', value: '12', delta: '+2 this week', up: true },
  { label: 'Team Members', value: '8', delta: '+1 this week', up: true },
  { label: 'API Requests', value: '48.2K', delta: '+12.4%', up: true },
  { label: 'Uptime', value: '99.98%', delta: '-0.01%', up: false },
]

const activity = [
  { title: 'New deployment', desc: 'main branch deployed to production', time: '2m ago' },
  { title: 'Invite sent', desc: 'sarah@example.com invited to Team', time: '1h ago' },
  { title: 'API key created', desc: 'New key generated for "mobile-app"', time: '3h ago' },
  { title: 'Billing updated', desc: 'Upgraded to Pro plan', time: '1d ago' },
]

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function DashboardClient({ user }: { user: User }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-white/40 backdrop-blur-md p-6">
        <div className="flex items-center gap-2 text-primary font-bold text-lg mb-10">
          <Rocket className="w-5 h-5" />
          LaunchFlow
        </div>

        <nav className="space-y-1">
          {navItems.map((n) => (
            <a
              key={n.label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                n.active
                  ? 'bg-primary text-white'
                  : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-foreground/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm text-foreground/50 hover:text-foreground rounded-xl hover:bg-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Overview</h1>
            <p className="text-sm text-foreground/50">Welcome back, {user.name.split(' ')[0]}.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-full bg-white/60 border border-border text-sm text-foreground/50">
              <Search className="w-4 h-4" />
              Search…
            </div>
            <button className="w-10 h-10 rounded-full bg-white/60 border border-border flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 px-4 text-sm font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              New Project
            </Button>
          </div>
        </header>

        <main className="p-6 space-y-8 max-w-6xl">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={item}>
                <Card className="p-5 bg-white/50 backdrop-blur border border-border/50">
                  <p className="text-sm text-foreground/50 mb-1">{s.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">{s.value}</span>
                    <span
                      className={`text-xs font-medium flex items-center gap-0.5 ${
                        s.up ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      <ArrowUpRight className={`w-3 h-3 ${!s.up && 'rotate-90'}`} />
                      {s.delta}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-white/50 backdrop-blur border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Usage this month
                  </h3>
                  <p className="text-sm text-foreground/50">Requests per day</p>
                </div>
                <Badge className="bg-secondary text-primary">+18% vs last month</Badge>
              </div>
              <div className="flex items-end gap-2 h-40">
                {[40, 65, 50, 80, 60, 90, 75, 95, 70, 85, 100, 78].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-linear-to-t from-primary to-accent rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: i * 0.04 }}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/50 backdrop-blur border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
                <MoreHorizontal className="w-4 h-4 text-foreground/40" />
              </div>
              <div className="space-y-4">
                {activity.map((a, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-foreground/50">{a.desc}</p>
                    <p className="text-xs text-foreground/30 mt-0.5">{a.time}</p>
                    {i < activity.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}