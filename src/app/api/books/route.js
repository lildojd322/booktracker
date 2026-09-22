import { NextResponse } from 'next/server'

export async function GET(request) {
    const q = request.nextUrl.searchParams.get('q') ?? 'subject:fiction'

    if (!process.env.API_KEY) {
        return NextResponse.json({ error: 'API_KEY not specified' }, { status: 500 })
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20&key=${process.env.API_KEY}`

    const response = await fetch(url, { next: { revalidate: 3600 } })
    const data = await response.json()

    return NextResponse.json(data, { status: res.status })
}