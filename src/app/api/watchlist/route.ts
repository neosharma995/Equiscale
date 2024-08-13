import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const { userId, watchlistNumber, symbol, price, percentChange } =
        await request.json()

    try {
        // Check if the item already exists in the watchlist
        const existingItem = await prisma.watchlist.findFirst({
            where: {
                userId,
                watchlistNumber,
                symbol,
            },
        })

        if (existingItem) {
            // If the item already exists, return a success response without adding it again
            return NextResponse.json(existingItem)
        }

        const watchlistItem = await prisma.watchlist.create({
            data: {
                userId,
                watchlistNumber,
                symbol,
                price,
                percentChange,
            },
        })
        return NextResponse.json(watchlistItem)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to add watchlist item' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const watchlistNumber = parseInt(
        url.searchParams.get('watchlistNumber') || '1',
        10
    )

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        )
    }

    try {
        const watchlist = await prisma.watchlist.findMany({
            where: { userId, watchlistNumber },
        })

        return NextResponse.json(watchlist)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch watchlist' },
            { status: 500 }
        )
    }
}

// Add this DELETE method
export async function DELETE(request: Request) {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const symbol = url.searchParams.get('symbol')
    const watchlistNumber = parseInt(
        url.searchParams.get('watchlistNumber') || '1',
        10
    )

    if (!userId || !symbol) {
        return NextResponse.json(
            { error: 'User ID and symbol are required' },
            { status: 400 }
        )
    }

    try {
        await prisma.watchlist.deleteMany({
            where: { userId, symbol, watchlistNumber },
        })

        return NextResponse.json({
            message: 'Watchlist item removed successfully',
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to remove watchlist item' },
            { status: 500 }
        )
    }
}
