import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    req: NextRequest,
    { params }: { params: { filename: string } }
) {
    const { filename } = params

    if (!filename || typeof filename !== 'string') {
        return NextResponse.json(
            { error: 'Invalid filename parameter' },
            { status: 400 }
        )
    }

    try {
        // Fetch data from the database
        const data = await db.financialDataStandalone.findFirst({
            where: {
                filename: filename,
            },
        })

        if (!data) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while fetching data' },
            { status: 500 }
        )
    }
}
