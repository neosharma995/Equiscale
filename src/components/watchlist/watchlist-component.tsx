'use client'
import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { Searchbar, Watchlist, WatchlistNavigation } from '@/components'
import styles from '@/components/watchlist/watchlist-component.module.css'

interface WatchlistItem {
    id?: string
    userId?: string
    symbol: string
    price: number
    percentChange: string
}

export const WatchlistComponent: React.FC = () => {
    const { data: session, status } = useSession()
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [activeWatchlist, setActiveWatchlist] = useState(1)

    useEffect(() => {
        if (session?.user?.id) {
            const fetchWatchlist = async () => {
                try {
                    const response = await fetch(
                        `/api/watchlist?userId=${session.user.id}&watchlistNumber=${activeWatchlist}`
                    )
                    const data = await response.json()
                    setWatchlist(data)
                } catch (error) {
                    console.error('Error fetching watchlist:', error)
                }
            }

            fetchWatchlist()
        }
    }, [session, activeWatchlist])

    useEffect(() => {
        const socket = io('http://localhost:4001')

        socket.on('stockData', (data: { [key: string]: WatchlistItem }) => {
            setWatchlist((prevWatchlist) =>
                prevWatchlist.map((item) => ({
                    ...item,
                    price: data[item.symbol]?.price ?? item.price,
                    percentChange:
                        data[item.symbol]?.percentChange ?? item.percentChange,
                }))
            )
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const addToWatchlist = async (item: WatchlistItem) => {
        if (session?.user?.id) {
            try {
                const response = await fetch('/api/watchlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...item,
                        userId: session.user.id,
                        watchlistNumber: activeWatchlist,
                    }),
                })
                const newItem = await response.json()
                if (!watchlist.some((w) => w.symbol === newItem.symbol)) {
                    setWatchlist([...watchlist, newItem])
                }
            } catch (error) {
                console.error('Error adding to watchlist:', error)
            }
        }
    }

    const handleBuy = (item: WatchlistItem) => {
        alert(`Buying ${item.symbol} at ₹${item.price}`)
    }

    const handleSell = (item: WatchlistItem) => {
        alert(`Selling ${item.symbol} at ₹${item.price}`)
    }

    const handleRemove = async (symbol: string) => {
        if (session?.user?.id) {
            try {
                await fetch(
                    `/api/watchlist?userId=${session.user.id}&symbol=${symbol}&watchlistNumber=${activeWatchlist}`,
                    {
                        method: 'DELETE',
                    }
                )
                setWatchlist(watchlist.filter((item) => item.symbol !== symbol))
            } catch (error) {
                console.error('Error removing from watchlist:', error)
            }
        }
    }

    const switchWatchlist = (watchlistNumber: number) => {
        setActiveWatchlist(watchlistNumber)
    }

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (status === 'unauthenticated') {
        return <p>Please log in to view your watchlist.</p>
    }

    return (
        <div className={styles.container}>
            <p className={styles.header}>Watchlist</p>
            <div className={styles['search-bar']}>
                <Searchbar onAddToWatchlist={addToWatchlist} />
            </div>
            <div className={styles.watchlist}>
                <Watchlist
                    watchlist={watchlist}
                    onBuy={handleBuy}
                    onSell={handleSell}
                    onRemove={handleRemove}
                />
            </div>
            <WatchlistNavigation
                activeWatchlist={activeWatchlist}
                onSwitchWatchlist={switchWatchlist}
            />
        </div>
    )
}
