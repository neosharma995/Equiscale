// components/watchlist/WatchlistNavigation.tsx
import React from 'react'
import styles from './watchlist-navigation.module.css'

interface WatchlistNavigationProps {
    activeWatchlist: number
    onSwitchWatchlist: (watchlistNumber: number) => void
}

export const WatchlistNavigation: React.FC<WatchlistNavigationProps> = ({
    activeWatchlist,
    onSwitchWatchlist,
}) => {
    return (
        <div className={styles['watchlist-tabs']}>
            {[...Array(8)].map((_, index) => (
                <button
                    key={index}
                    className={`${styles.tab} ${activeWatchlist === index + 1 ? styles.active : ''}`}
                    onClick={() => onSwitchWatchlist(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    )
}
