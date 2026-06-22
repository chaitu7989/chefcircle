import { NextRequest, NextResponse } from 'next/server'
import { verifySession, COOKIE_NAME } from '@/lib/session'

const PROTECTED = ['/customer/dashboard', '/chef/dashboard', '/auth/onboarding']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin protection — redirect to admin login if no admin cookie
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminCookie = req.cookies.get('cc_admin')?.value
    if (!adminCookie || adminCookie !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const session = await verifySession(token)
  if (!session) {
    const res = NextResponse.redirect(new URL('/auth/login', req.url))
    res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
    return res
  }

  // Role-based guard
  if (pathname.startsWith('/chef/dashboard') && session.role !== 'chef') {
    return NextResponse.redirect(new URL('/customer/dashboard', req.url))
  }
  if (pathname.startsWith('/customer/dashboard') && session.role !== 'customer') {
    return NextResponse.redirect(new URL('/chef/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/customer/dashboard/:path*', '/chef/dashboard/:path*', '/auth/onboarding/:path*', '/auth/onboarding', '/admin/:path*', '/admin'],
}
