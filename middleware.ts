import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const userId = request.cookies.get('userId')?.value

    const isPublic = pathname.startsWith('/sign-in') || pathname.startsWith('/api')

    if (!userId && !isPublic) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)'],
}
