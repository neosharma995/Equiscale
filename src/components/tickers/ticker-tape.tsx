'use client'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import styles from '@/components/tickers/ticker-tape.module.css'

// Define TypeScript interfaces for stock data
interface Stock {
    symbol: string
    price: number
    percentChange: string
}

interface StockData {
    [key: string]: Stock
}

export const TickerTape: React.FC = () => {
    const [stockData, setStockData] = useState<StockData>({})

    useEffect(() => {
        // Create a socket connection with the server URL
        const socket = io('http://localhost:4001', {
            transports: ['websocket'],
        })

        // Handle connection and data reception
        socket.on('connect', () => {
            console.log('Connected to server')
        })

        socket.on('stockData', (data: StockData) => {
            setStockData(data)
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
    }, [])

    // Generate ticker items
    const tickerItems = Object.values(stockData).map((stock) => (
        <li
            key={stock.symbol}
            className={
                stock.percentChange.startsWith('-') ? styles.down : styles.up
            }
        >
            {stock.symbol} ₹{stock.price} <span>{stock.percentChange}%</span>
        </li>
    ))

    return (
        <div className={styles.tickerTape}>
            <ul className={styles.ticker}>{tickerItems}</ul>
        </div>
    )
}
