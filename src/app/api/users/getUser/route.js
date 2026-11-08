import { getUserFromDBByUsername } from "@/lib/db"
import { NextResponse } from "next/server"



export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            )
        }


        const user = await getUserFromDBByUsername(username)


        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            user
        })

    } catch (error) {
        console.error("API ERROR:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}