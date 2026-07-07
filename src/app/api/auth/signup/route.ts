import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateSignupPayload } from '@/lib/validation'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, errors: [{ field: 'general', message: 'Invalid JSON body.' }] },
      { status: 400 }
    )
  }

  // ── Server-side field validation ──────────────────────────────────────────
  const validation = validateSignupPayload(body)
  if (!validation.ok) {
    return NextResponse.json({ success: false, errors: validation.errors }, { status: 422 })
  }

  const { username, email, password } = body as {
    username: string
    email: string
    password: string
    confirmPassword: string
  }

  try {
    const existingEmail = await prisma.user.findUnique({
      where: { email: email }
    })
    if (existingEmail) {
      return NextResponse.json(
        { success: false, errors: [{ field: 'email', message: 'This email address is already registered.' }] },
        { status: 409 }
      )
    }

    const existingUsername = await prisma.user.findFirst({
      where: { name: username.trim() },
    })
    if (existingUsername) {
      return NextResponse.json(
        { success: false, errors: [{ field: 'username', message: 'This username is already taken.' }] },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name: username.trim(),
        email: email,
        password: password,
      },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    const res = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user,
      },
      { status: 201 }
    )

    res.cookies.set('session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
    
  } catch (error) {
    
    return NextResponse.json(
      { success: false, errors: [{ field: 'general', message: 'Something went wrong. Please try again.' }] },
      { status: 500 }
    )
  }
}