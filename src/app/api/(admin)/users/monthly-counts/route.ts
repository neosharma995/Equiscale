import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
        // Fetch all users with a verified email
        const users = await db.user.findMany({
            where: {
                emailVerified: {
                    gte: new Date('2020-01-01'), // Adjust start date as needed
                },
            },
        })

        // Manually aggregate data by year
        const yearlyCounts = users.reduce(
            (acc, user) => {
                if (user.emailVerified) {
                    const year = user.emailVerified.getFullYear()
                    if (!acc[year]) {
                        acc[year] = 0
                    }
                    acc[year]++
                }
                return acc
            },
            {} as Record<number, number>
        )

        // Sort years and prepare labels and data
        const sortedYears = Object.keys(yearlyCounts)
            .map((year) => Number(year))
            .sort((a, b) => a - b)
        const labels = sortedYears.map((year) => year.toString())
        const data = sortedYears.map((year) => yearlyCounts[year])

        return NextResponse.json({ labels, data })
    } catch (error) {
        console.error('Error fetching yearly user counts:', error)
        return NextResponse.error()
    }
}
