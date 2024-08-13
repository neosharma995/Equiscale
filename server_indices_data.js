const express = require('express')
const http = require('http')
const { Server: SocketIOServer } = require('socket.io')
const next = require('next')

// JSON data for indices
const indicesData = [
    {
        symbol: 'SPX',
        name: 'S&P 500',
        price: 4401.46,
        change: -23.55,
    },
    {
        symbol: 'DJI',
        name: 'Dow Jones Industrial Average',
        price: 34528.48,
        change: -150.27,
    },
    {
        symbol: 'IXIC',
        name: 'NASDAQ Composite',
        price: 13694.84,
        change: -72.08,
    },
    {
        symbol: 'FTSE',
        name: 'FTSE 100',
        price: 7280.49,
        change: 34.72,
    },
    {
        symbol: 'N225',
        name: 'Nikkei 225',
        price: 28574.9,
        change: -12.42,
    },
    {
        symbol: 'HSI',
        name: 'Hang Seng Index',
        price: 26428.0,
        change: 132.39,
    },
    {
        symbol: 'DAX',
        name: 'DAX',
        price: 15611.72,
        change: -41.64,
    },
    {
        symbol: 'CAC',
        name: 'CAC 40',
        price: 6510.55,
        change: -15.98,
    },
    {
        symbol: 'ASX',
        name: 'S&P/ASX 200',
        price: 7283.1,
        change: 10.57,
    },
    {
        symbol: 'SHCOMP',
        name: 'Shanghai Composite',
        price: 3521.0,
        change: -20.43,
    },
]

// Initialize Next.js app
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Create an Express application
const server = express()
const httpServer = http.createServer(server)
const io = new SocketIOServer(httpServer)

// Initial stock data
const stockData = indicesData.reduce((acc, index) => {
    const open = parseFloat((Math.random() * 1000).toFixed(2))
    acc[index.symbol] = {
        symbol: index.symbol,
        name: index.name,
        open,
        price: open,
        high: open,
        low: open,
        close: open,
        percentChange: '0',
        timestamp: new Date(),
    }
    return acc
}, {})

// Function to update stock data
const updateStockData = () => {
    Object.keys(stockData).forEach((symbol) => {
        const data = stockData[symbol]

        // Simulate small, gradual changes
        const change = parseFloat((Math.random() * 2 - 1).toFixed(2)) // Between -1 and +1
        const newPrice = parseFloat((data.price + change).toFixed(2))

        // Ensure new price is within a reasonable range
        if (newPrice > 0) {
            data.price = newPrice
            data.high = Math.max(data.high, newPrice)
            data.low = Math.min(data.low, newPrice)
            data.close = newPrice

            // Calculate percentage change
            data.percentChange = (
                ((data.close - data.open) / data.open) *
                100
            ).toFixed(2)

            // Update timestamp
            data.timestamp = new Date()
        }
    })
}

// WebSocket connection
io.on('connection', (socket) => {
    console.log('indices data server connected')

    // Emit real-time data to clients
    const sendData = () => {
        updateStockData()
        socket.emit('stockData', stockData)
    }

    // Send data every 2 seconds
    const interval = setInterval(sendData, 2000)

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected')
        clearInterval(interval)
    })
})

// REST API route to get stock data
server.get('/api/stocks', (req, res) => {
    res.json(stockData)
})

// REST API route to get stock data for a specific symbol
server.get('/api/stocks/:symbol', (req, res) => {
    const symbol = decodeURIComponent(req.params.symbol)
    const data = stockData[symbol]
    if (data) {
        res.json(data)
    } else {
        res.status(404).json({ error: 'Stock symbol not found' })
    }
})

// Handle all other requests with Next.js
server.all('*', (req, res) => {
    return handle(req, res)
})

// Start the server
const PORT = process.env.PORT || 4002
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
