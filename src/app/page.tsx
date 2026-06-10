'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Zap,
  Shield,
  Rocket,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="text-xl font-bold text-primary flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Rocket className="w-6 h-6" />
              LaunchFlow
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <motion.a
                href="#features"
                className="text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#pricing"
                className="text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
              >
                Pricing
              </motion.a>
              <motion.a
                href="#about"
                className="text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
              >
                About
              </motion.a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4 space-y-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <a
                href="#features"
                className="block text-foreground/70 hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-foreground/70 hover:text-foreground"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block text-foreground/70 hover:text-foreground"
              >
                About
              </a>
              <div className="pt-3 space-y-2 border-t border-border">
                <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Get Started
                    </Button>
                  </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <Badge className="bg-secondary text-primary w-fit">
                ✨ Now Live
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
                Launch Your{' '}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  Next Big Idea
                </span>{' '}
                Faster
              </h1>
              <p className="text-lg text-foreground/70 max-w-lg leading-relaxed text-balance">
                The complete platform for building, deploying, and scaling your
                next product. From idea to millions of users in record time.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-full text-base font-semibold group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex gap-8 pt-4 text-sm text-foreground/60"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                No credit card required
              </div>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            className="relative h-96 md:h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-xl border border-primary/20 p-8 shadow-2xl"
            >
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary/20 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary/10 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/30 rounded w-3/4"></div>
                    <div className="h-2 bg-primary/20 rounded w-1/2"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-primary/20 rounded-lg"></div>
                    <div className="h-12 bg-accent/20 rounded-lg"></div>
                  </div>
                  <div className="h-16 bg-primary/10 rounded-lg"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-primary/20 rounded"></div>
                  <div className="h-2 bg-primary/10 rounded w-5/6"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-secondary text-primary mb-4">Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Powerful tools designed to help you build, deploy, and scale your
            application with confidence
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Zap,
              title: 'Fast Setup',
              description:
                'Get started in minutes with our intuitive setup wizard and pre-built templates.',
            },
            {
              icon: Shield,
              title: 'Secure Platform',
              description:
                'Enterprise-grade security with end-to-end encryption and compliance standards.',
            },
            {
              icon: Rocket,
              title: 'Scalable Infrastructure',
              description:
                'Grow from zero to millions of users without worrying about infrastructure.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="p-8 h-full bg-white/50 backdrop-blur hover:bg-white/70 transition-colors border border-border/50 hover:border-primary/20 cursor-pointer">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { value: '10K+', label: 'Users' },
            { value: '99.9%', label: 'Uptime' },
            { value: '50+', label: 'Countries' },
            { value: '1M+', label: 'Requests' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-foreground/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* CTA Section */}
      <section
        id="pricing"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
      >
        <motion.div
          className="bg-linear-to-r from-primary/10 to-accent/10 rounded-3xl p-12 md:p-16 border border-primary/20 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to Start Building?
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Join thousands of developers already using LaunchFlow to build
                their next big idea. Start free today.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-full text-base font-semibold group">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full text-base font-semibold"
              >
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5" />
                LaunchFlow
              </div>
              <p className="text-foreground/60 text-sm">
                Build, deploy, and scale your next big idea.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          <Separator />

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
            <p>&copy; 2024 LaunchFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
