import React, { ReactNode } from 'react'
import Sidebar from './sidebar/page'
import './adminLayout.css' // Import the CSS file

interface AdminLayoutProps {
    children: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="main-content">{children}</main>
        </div>
    )
}

export default AdminLayout
