import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    adminRoutes,
    publicRoutes,
} from '@/routes'

interface AuthenticatedRequest extends NextRequest {
    auth?: {
        user?: {
            role?: string
        }
    }
}

export default auth((req: NextRequest) => {
    const { nextUrl } = req as AuthenticatedRequest
    const isLoggedIn = !!(req as AuthenticatedRequest).auth
    const userRole = (req as AuthenticatedRequest).auth?.user?.role

    // Check if the route is an API auth route
    if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
        return NextResponse.next()
    }

    // Handle public routes
    if (publicRoutes.includes(nextUrl.pathname)) {
        return NextResponse.next()
    }

    // Handle auth routes
    if (authRoutes.includes(nextUrl.pathname)) {
        if (isLoggedIn) {
            if (userRole === 'ADMIN') {
                return NextResponse.redirect(
                    new URL(adminRoutes, nextUrl.origin)
                )
            } else {
                return NextResponse.redirect(
                    new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin)
                )
            }
        }
        return NextResponse.next()
    }

    // Handle admin routes
    if (nextUrl.pathname.startsWith(adminRoutes)) {
        if (!isLoggedIn || userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/auth/login', nextUrl.origin))
        }
        return NextResponse.next()
    }

    // Redirect unauthenticated users from protected routes
    // if (!isLoggedIn) {
    //   return NextResponse.redirect(new URL("/auth/login", nextUrl.origin));
    // }

    // return NextResponse.next();
})

// Optionally, don't invoke middleware on some paths
export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
