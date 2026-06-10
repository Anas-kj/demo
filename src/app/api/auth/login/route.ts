import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

  const { email, password } = (body ?? {}) as { email?: string; password?: string }

  if (!email?.trim() || !password) {
    return NextResponse.json(
      { success: false, errors: [{ field: 'general', message: 'Email and password are required.' }] },
      { status: 422 }
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  try {

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    const passwordValid = user ? await bcrypt.compare(password, user.password) : false

    if (!user || !passwordValid) {
      return NextResponse.json(
        { success: false, errors: [{ field: 'general', message: 'Invalid email or password.' }] },
        { status: 401 }
      )
    }

    const res = NextResponse.json(
      {
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    )

    res.cookies.set('session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error) {
    console.error('[login] failed:', error)

    return NextResponse.json(
      { success: false, errors: [{ field: 'general', message: 'Something went wrong. Please try again.' }] },
      { status: 500 }
    )
  }
}