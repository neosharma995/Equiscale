'use client'
import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import styles from '@/components/searchBar/search.module.css'

interface WatchlistItem {
    symbol: string
    price: number
    percentChange: string
}

interface SearchBarProps {
    onAddToWatchlist: (item: WatchlistItem) => void
}

export const Searchbar: React.FC<SearchBarProps> = ({ onAddToWatchlist }) => {
    const [query, setQuery] = useState<string>('')
    const [results, setResults] = useState<WatchlistItem[]>([])
    const [socket, setSocket] = useState<any>(null)

    useEffect(() => {
        // Initialize the WebSocket connection
        const socketIo = io('http://localhost:4001')
        setSocket(socketIo)

        // Listen for stock data updates from the server
        socketIo.on(
            'stockData',
            (updatedStocks: Record<string, WatchlistItem>) => {
                setResults((prevResults) =>
                    prevResults.map((item) =>
                        updatedStocks[item.symbol]
                            ? updatedStocks[item.symbol]
                            : item
                    )
                )
            }
        )

        return () => {
            socketIo.disconnect()
        }
    }, [])

    useEffect(() => {
        if (query.length === 0) {
            setResults([])
            return
        }

        const fetchResults = async () => {
            try {
                const response = await fetch(
                    `http://localhost:4001/api/search?q=${encodeURIComponent(query)}`
                )
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data: string[] = await response.json()
                const results: WatchlistItem[] = await Promise.all(
                    data.map(async (symbol) => {
                        const res = await fetch(
                            `http://localhost:4001/api/stocks/${encodeURIComponent(symbol)}`
                        )
                        if (!res.ok) {
                            throw new Error('Failed to fetch stock data')
                        }
                        return res.json()
                    })
                )
                setResults(results)
            } catch (error) {
                console.error('Fetching error:', error)
                setResults([])
            }
        }

        fetchResults()
    }, [query])

    const handleResultClick = (item: WatchlistItem) => {
        onAddToWatchlist(item)
        setQuery('') // Clear the search bar
        setResults([]) // Optionally clear results as well
    }

    return (
        <div className={styles['searchbar-container']}>
            <input
                type="text"
                placeholder="Search for a stock..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles['searchbar-input']}
            />
            <ul className={styles['searchbar-results']}>
                {results.map((item) => (
                    <li
                        key={item.symbol}
                        className={styles['searchbar-result-item']}
                        onClick={() => handleResultClick(item)}
                    >
                        {item.symbol}
                    </li>
                ))}
            </ul>
        </div>
    )
}
