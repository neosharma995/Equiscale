'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface User {
    id: string
    name: string
    email: string
    createdAt: string
}

const UserDetail: React.FC = () => {
    const [user, setUser] = useState<User | null>(null)
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/users/user-counts?id=${id}`)
                    if (!res.ok) {
                        throw new Error('Network response was not ok')
                    }
                    const userData = await res.json()
                    setUser(userData)
                } catch (error) {
                    console.error('Failed to fetch user:', error)
                }
            }
            fetchUser()
        }
    }, [id])

    if (!user) return <div className="text-center text-xl">Loading...</div>

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
            <p className="text-lg mb-2">
                <strong>Email:</strong> {user.email}
            </p>
            <p className="text-lg">
                <strong>Joined:</strong>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
            </p>
        </div>
    )
}

export default UserDetail
