import React, { ReactNode } from 'react'
import { Sidebar } from '@/components'
// import './UserLayout.css' // Import the CSS file

interface UserLayoutProps {
    children: ReactNode
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <main className="main-content">{children}</main>
        </div>
    )
}

export default UserLayout
