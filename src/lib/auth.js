import GoogleProvider from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials";
import { compare } from 'bcrypt'
import { headers } from 'next/headers'
import { checkLimit } from './ratelimit'
import { redis } from './redis'
import { loginSchema } from '@/lib/zod'
import { getUserFromDBByEmail} from '@/lib/db'

export const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            credentials: {
                email: { label: 'email', type: 'email', required: true },
                password: { label: 'password', type: 'password', required: true },
            },
            async authorize(credentials) {
                if (!credentials) return null

                const { email, password } = credentials
                const cleanEmail = email ? email.trim().toLowerCase() : ""

                const currentUser = await getUserFromDBByEmail(cleanEmail)
                if (!currentUser) {
                    throw new Error("UserNotFound")
                }

                if (password && password.length === 64) {

                    const savedBypassToken = await redis.get(`bypass_token:${cleanEmail}`)

                    if (savedBypassToken && savedBypassToken === password) {
                        await redis.del(`bypass_token:${cleanEmail}`) 
                        const { password: _, ...userWithoutPass } = currentUser
                        return userWithoutPass 
                    }
                }


                const parsedCredentials = loginSchema.safeParse(credentials)
                if (!parsedCredentials.success) {
                    return null
                }


                const headersList = await headers()
                const ip = headersList.get('x-forwarded-for') || 'unknown'
                const key = `${ip}:${cleanEmail}`
                const limit = await checkLimit(key)

                if (!limit.allowed) {
                    throw new Error('TooManyAttempts')
                }

                if (currentUser && currentUser.password) {
                    const isPasswordCorrect = await compare(
                        parsedCredentials.data.password,
                        currentUser.password
                    )

                    if (!isPasswordCorrect) {
                        return null
                    }

                    if (!currentUser.emailVerified) {
                        throw new Error("EmailNotVerified")
                    }

  
                    await redis.del(`rate_limit:${key}`)
                    const { password: _, ...userWithoutPass } = currentUser
                    return userWithoutPass
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/signIn',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const currentUser = await getUserFromDBByEmail(user.email)

                    if (!currentUser) {
                        await createGoogleUserInDB({
                            name: user.name,
                            email: user.email,
                            image: user.image
                        })
                    }
                } catch (error) {
                    console.error("Error saving google user:", error)
                    return true
                }
            }
            return true
        },

        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                session.user.provider = token.provider
                session.user.image = token.picture
                session.user.username = token.username
                session.user.email = token.email
                session.user.createdAt = token.createdAt
            }
            return session
        },
        async jwt({ token, user, account, session, trigger }) {
            if (trigger === 'update' && session?.image) {
                token.picture = session.image
                return token
            }
            if (user) {
                if (account) {
                    token.picture = user.image
                    token.email = user.email
                    token.provider = account.provider
                }
                if (account?.provider === "google") {
                    const dbUser = await getUserFromDBByEmail(user.email)
                    if (dbUser) {
                        token.username = dbUser.username
                        token.sub = String(dbUser.id)
                        token.createdAt = dbUser.created_at
                    }
                } else {
                    token.sub = String(user.id)
                    token.username = user.username
                    token.createdAt = user.created_at
                }
            }
            return token
        }
    }
}
