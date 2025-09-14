import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  ;(await cookieStore).delete(process.env.COOKIE_NAME || 'auth-token')
  return NextResponse.json({ success: true })
}
