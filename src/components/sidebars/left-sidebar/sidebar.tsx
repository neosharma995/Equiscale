'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import styles from './sidebar.module.css'

const Sidebar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen)
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>equiscale</h2>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link href="/markets">Markets</Link>
                    </li>
                    <li>
                        <div
                            onClick={toggleDropdown}
                            className={styles.dropdownLink}
                        >
                            Company Details
                        </div>
                        {isDropdownOpen && (
                            <ul className={styles.dropdown}>
                                <li>
                                    <Link href="/company-details#peer">
                                        Peer
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company-details#quarterly">
                                        Quarterly
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company-details#profit-loss">
                                        Profit & Loss
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company-details#balance-sheet">
                                        Balance Sheet
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company-details#cash-flow">
                                        Cash Flow
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company-details#ratios">
                                        Ratios
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link href="/future-options">Future & Options</Link>
                    </li>
                    <li>
                        <Link href="/portfolio">My Portfolio</Link>
                    </li>
                    <li>
                        <Link href="/screeners">Screeners</Link>
                    </li>
                    <li>
                        <Link href="/economic-indicators">
                            Economic Indicators
                        </Link>
                    </li>
                    <li>
                        <Link href="/sectors">Sectors</Link>
                    </li>
                    <li>
                        <Link href="/all-stocks">All Stocks</Link>
                    </li>
                    <li>
                        <Link href="/news">News</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
