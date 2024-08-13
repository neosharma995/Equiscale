import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const userId = url.searchParams.get('id')
    const countParam = url.searchParams.get('count')
    const watchlistParam = url.searchParams.get('watchlist')

    if (countParam === '') {
        // Fetch the total user count
        const userCount = await db.user.count()
        return NextResponse.json({ count: userCount })
    } else if (userId && watchlistParam === 'true') {
        // Fetch the watchlist for the specific user with only selected fields
        try {
            const watchlist = await db.watchlist.findMany({
                where: { userId: userId },
                select: { watchlistNumber: true, symbol: true }, // Select only specific fields
                orderBy: { watchlistNumber: 'asc' }, // Optional: Order by watchlistNumber
            })
            return NextResponse.json(watchlist)
        } catch (error) {
            console.error('Error fetching watchlist:', error)
            return NextResponse.json({ error: 'Error fetching watchlist' })
        }
    } else if (userId) {
        // Fetch a specific user by ID along with their watchlist
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
                include: {
                    watchlist: {
                        select: { watchlistNumber: true, symbol: true },
                    },
                }, // Include only selected fields
            })
            if (!user) {
                return NextResponse.json({ error: 'User not found' })
            }
            return NextResponse.json(user)
        } catch (error) {
            console.error('Error fetching user:', error)
            return NextResponse.json({ error: 'Error fetching user' })
        }
    } else {
        // Fetch all users with their watchlists
        try {
            const users = await db.user.findMany({
                include: {
                    watchlist: {
                        select: { watchlistNumber: true, symbol: true },
                    }, // Include only selected fields
                },
            })
            return NextResponse.json(users)
        } catch (error) {
            console.error('Error fetching users:', error)
            return NextResponse.json({ error: 'Error fetching users' })
        }
    }
}
