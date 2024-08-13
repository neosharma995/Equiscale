import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { LoginSchema } from '@/utils'
import { db } from './lib/db'
import { getUserByEmail, getUserById } from '@/data/user'

declare module 'next-auth' {
    interface Session {
        user: {
            role: UserRole
        } & DefaultSession['user']
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            })
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allows OAuth without email verification
            if (account?.provider !== 'credentials') return true

            if (user.id) {
                const existingUser = await getUserById(user.id)

                // Prevent sign in without email verification
                if (!existingUser || !existingUser.emailVerified) return false
                return true
            }
            return false
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }
            return session
        },
        async jwt({ token }) {
            if (token.sub) {
                const existingUser = await getUserById(token.sub)

                if (existingUser) {
                    token.role = existingUser.role
                }
            }
            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await getUserByEmail(email)
                    if (user && user.password) {
                        const passwordsMatch = await bcrypt.compare(
                            password,
                            user.password
                        )

                        if (passwordsMatch) return user
                    }
                }
                return null
            },
        }),
    ],
})
