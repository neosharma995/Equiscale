'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import styles from '@/components/sliders/index-slider/slider.module.css'

// Define TypeScript interfaces for stock data
interface Stock {
    symbol: string
    name: string
    price: number
    percentChange: string
}

interface StockData {
    [key: string]: Stock
}

export const IndexSlider: React.FC = () => {
    const [stockData, setStockData] = useState<StockData>({})
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const itemsPerPage = 4
    const stockKeys = Object.keys(stockData)

    useEffect(() => {
        // Create a socket connection with the server URL
        const socket = io('http://localhost:4002', {
            transports: ['websocket'],
        })

        // Handle connection and data reception
        socket.on('connect', () => {
            console.log('Connected to server')
        })

        socket.on('stockData', (data: StockData) => {
            setStockData(data)
            // Reset index only if the data is new and currentIndex is out of range
            if (currentIndex >= Object.keys(data).length) {
                setCurrentIndex(0)
            }
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from server')
        })

        socket.on('error', (error: any) => {
            console.error('Socket error:', error)
        })

        // Clean up on component unmount
        return () => {
            socket.disconnect()
        }
    }, [currentIndex])

    // Handle next button click
    const handleNext = () => {
        if (currentIndex + itemsPerPage < stockKeys.length) {
            setCurrentIndex(currentIndex + itemsPerPage)
        }
    }

    // Handle previous button click
    const handlePrev = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage)
        }
    }

    // Generate ticker items
    const tickerItems = stockKeys
        .slice(currentIndex, currentIndex + itemsPerPage)
        .map((key) => {
            const stock = stockData[key]
            return (
                <div key={stock.symbol} className={styles.tickerItem}>
                    <div className={styles.stockSymbol}>{stock.symbol}</div>
                    <div className={styles.stockPrice}>
                        {stock.price.toLocaleString()} USD
                    </div>
                    <div
                        className={
                            stock.percentChange.startsWith('-')
                                ? styles.down
                                : styles.up
                        }
                    >
                        {stock.percentChange}%
                    </div>
                </div>
            )
        })

    // Determine if the "View All Indices" item should be shown
    const showViewAll = currentIndex + itemsPerPage >= stockKeys.length

    if (showViewAll && tickerItems.length < itemsPerPage) {
        tickerItems.push(
            <div
                key="view-all"
                className={`${styles.tickerItem} ${styles.viewAllItem}`}
            >
                <div className={styles.viewAll}>See all indices</div>
            </div>
        )
    }

    return (
        <div className={styles.tickerTape}>
            <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={styles.navButton}
            >
                ◀
            </button>
            <div className={styles.tickerContainer}>{tickerItems}</div>
            <button
                onClick={handleNext}
                disabled={currentIndex + itemsPerPage >= stockKeys.length}
                className={styles.navButton}
            >
                ▶
            </button>
        </div>
    )
}
