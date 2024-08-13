'use client'
import React, { useEffect, useState } from 'react'
import BarChartComponent from '@/components/admin-dashboard/charts/barChart/page'

interface User {
    id: string
    name: string
    email: string
    createdAt: string
    watchlist: Watchlist[]
}

interface Watchlist {
    watchlistNumber: number
    symbol: string
}

const AdminDashboard: React.FC = () => {
    const [userCounts, setUserCounts] = useState<{
        labels: string[]
        data: number[]
    }>({ labels: [], data: [] })
    const [users, setUsers] = useState<User[]>([])
    const [totalUserCount, setTotalUserCount] = useState<number>(0) // New state for total user count
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            // Example API call to get monthly user counts
            const response = await fetch('/api/users/monthly-counts')
            const data = await response.json()
            setUserCounts(data) // Assume data is { labels: ['2024', '2025'], data: [100, 200] }

            const usersRes = await fetch('/api/users/user-counts')
            const usersData = await usersRes.json()
            setUsers(usersData)
            setTotalUserCount(usersData.length) // Set total user count
        }
        fetchData()
    }, [])

    const handleUserClick = async (userId: string) => {
        try {
            const response = await fetch(
                `/api/users/user-counts?id=${userId}&watchlist=true`
            )
            if (!response.ok) throw new Error('Failed to fetch watchlist')
            const watchlistData = await response.json()
            const userRes = await fetch(`/api/users/user-counts?id=${userId}`)
            const userData = await userRes.json()
            setSelectedUser({ ...userData, watchlist: watchlistData })
        } catch (error) {
            console.error('Error fetching user or watchlist:', error)
        }
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Total User Count: {totalUserCount}</h2>{' '}
                {/* Display total user count */}
                <h2>User Growth Over Time</h2>
                <BarChartComponent
                    labels={userCounts.labels}
                    data={userCounts.data}
                />
            </div>
            <div>
                <h2>User Details</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <a
                                onClick={() => handleUserClick(user.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {user.name}
                            </a>
                        </li>
                    ))}
                </ul>
                {selectedUser && (
                    <div>
                        <h3>{selectedUser.name}'s Watchlist</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Watchlist Number</th>
                                    <th>Symbol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedUser.watchlist.map((item) => (
                                    <tr key={item.watchlistNumber}>
                                        <td>{item.watchlistNumber}</td>
                                        <td>{item.symbol}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
