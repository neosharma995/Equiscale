import { auth, signOut } from '@/auth'
import Link from 'next/link'

import Logout from '@/app/auth/logout/page'
import './sidebar.css' // Import the CSS file

const Sidebar: React.FC = async () => {
    const session = await auth()

    return (
        <div className="sidebar">
            <div className="header">Admin Dashboard</div>
            <div>
                <div>
                    <form
                        action={async () => {
                            'use server'
                            await signOut()
                        }}
                    >
                        <div>
                            <Logout />
                        </div>
                    </form>
                </div>
            </div>
            <nav>
                <Link href="/admin" className="nav-link">
                    Dashboard
                </Link>
                <Link href="/admin/users" className="nav-link">
                    Users
                </Link>
                <Link href="/admin/analytics" className="nav-link">
                    Analytics
                </Link>
            </nav>
        </div>
    )
}

export default Sidebar
