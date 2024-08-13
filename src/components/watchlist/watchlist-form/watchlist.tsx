'use client'
import React from 'react'
import styles from './watchlist.module.css'

interface WatchlistItem {
    symbol: string
    price: number
    percentChange: string
}

interface WatchlistProps {
    watchlist: WatchlistItem[]
    onBuy: (item: WatchlistItem) => void
    onSell: (item: WatchlistItem) => void
    onRemove: (symbol: string) => void
}

export const Watchlist: React.FC<WatchlistProps> = ({
    watchlist,
    onBuy,
    onSell,
    onRemove,
}) => {
    return (
        <div className={styles['watchlist-container']}>
            <ul>
                {watchlist.map((item, index) => (
                    <li key={index} className={styles['watchlist-item']}>
                        <span className={styles['watchlist-item-symbol']}>
                            {item.symbol}
                        </span>{' '}
                        -
                        <span className={styles['watchlist-item-price']}>
                            ₹{item.price}
                        </span>
                        (
                        <span
                            className={styles['watchlist-item-percent-change']}
                        >
                            {item.percentChange}%
                        </span>
                        )
                        <div className={styles.buttons}>
                            <button
                                className={styles.button + ' ' + styles.buy}
                                onClick={() => onBuy(item)}
                            >
                                Buy
                            </button>
                            <button
                                className={styles.button + ' ' + styles.sell}
                                onClick={() => onSell(item)}
                            >
                                Sell
                            </button>
                            <button
                                className={styles.button + ' ' + styles.remove}
                                onClick={() => onRemove(item.symbol)}
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
