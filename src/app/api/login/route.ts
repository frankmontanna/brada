import { comparePassword, generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const username = body?.username?.toString() ?? ''
    const password = body?.password?.toString() ?? ''

    if (!username || !password) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user?.active) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = generateToken(user.id)

    const forwardedProto = req.headers.get('x-forwarded-proto') 
    const isHttps =
      (forwardedProto && forwardedProto.toLowerCase() === 'https') ||
      (process.env.APP_URL?.startsWith('https://') ?? false)

    const res = NextResponse.json({
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
    })

    const cookieName = process.env.COOKIE_NAME || 'auth-token'
    res.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch {
    return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }
}
