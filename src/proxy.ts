import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'
import { getToken } from 'next-auth/jwt'

export const config = { matcher: ['/profile', '/protected/:path*', '/signIn', '/register', '/api/:path*'] }


async function handleRateLimit(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1'

    const redisKey = `pr1:ratelimit:${ip}`
    try {
        const currentRequests = await redis.incr(redisKey)
        if (currentRequests === 1) {
            await redis.expire(redisKey, 60)
        }

        if (currentRequests > 60) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            )
        }
    } catch (error) {
        console.error('Upstash Redis Error:', error)
    }

    return null

}



export async function proxy(request: NextRequest) {
    let sessionToken = request.cookies.get('__Secure-next-auth.session-token') ||
        request.cookies.get('next-auth.session-token')

    const { pathname } = request.nextUrl

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    const isAuthorized = !!token
    const username = token?.username


    if (pathname.startsWith('/api')) {
        const limitResponse = await handleRateLimit(request)
        if (limitResponse) {
            return limitResponse
        }
    }
    if ( isAuthorized && sessionToken) {
        if (pathname === '/signIn' || pathname === '/register') {

            return NextResponse.redirect(new URL(`/profile/${username}`, request.url))
        }

        return NextResponse.next()
    }
    if (!isAuthorized) {
        if (pathname === '/settings') {
            return NextResponse.redirect(new URL('/signIn', request.url))
        }

    }

    return NextResponse.next()
}