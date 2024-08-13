'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

const Logout = () => {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false }) // Sign out without redirecting immediately
        router.push('/auth/login') // Redirect to login page manually after sign-out
    }

    return (
        <div>
            <button onClick={handleSignOut} className="button">
                Logout
            </button>
        </div>
    )
}

export default Logout
