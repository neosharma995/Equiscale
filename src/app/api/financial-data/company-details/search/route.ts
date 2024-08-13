// app/api/financial-data/search/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')

    if (!query || typeof query !== 'string') {
        return NextResponse.json(
            { error: 'Invalid query parameter' },
            { status: 400 }
        )
    }

    try {
        const results = await db.financialDataConsolidated.findMany({
            where: {
                filename: {
                    startsWith: query, // Matches filenames that start with the query string
                    mode: 'insensitive', // Case-insensitive search
                },
            },
        })

        return NextResponse.json(results)
    } catch (error) {
        console.error('Error fetching financial data:', error)
        return NextResponse.json(
            { error: 'An error occurred while searching' },
            { status: 500 }
        )
    }
}
