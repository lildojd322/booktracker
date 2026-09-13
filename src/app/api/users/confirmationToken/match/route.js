import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { redis } from "@/lib/redis"
import { updateUserVerificationToken } from '@/lib/db'

export async function POST(request) {
    try {
        const body = await request.json()
        const { email, code } = body


        if (!email || !code) {
            return NextResponse.json({ success: false, error: 'Missing data.' }, { status: 400 })
        }
        const cleanEmail = email.trim().toLowerCase()

        const rawSavedCode = await redis.get(`auth_code:${cleanEmail}`)

        const savedCode = rawSavedCode ? String(rawSavedCode) : null

        if (!savedCode || savedCode !== code.trim()) {
            return NextResponse.json({ success: false, error: 'Invalid or expired code.' }, { status: 400 })
        }

        await redis.del(`auth_code:${cleanEmail}`)

        await updateUserVerificationToken(cleanEmail)

        return NextResponse.json({ success: true })


    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }

}