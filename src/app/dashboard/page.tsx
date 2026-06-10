import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from '@/components/DashboardClient'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session')?.value

  if (!userId) {
    redirect('/signup')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  })

  if (!user) {
    redirect('/signup')
  }

  return <DashboardClient user={user} />
}