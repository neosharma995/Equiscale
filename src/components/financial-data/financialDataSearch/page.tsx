'use client'
import React, { useState, useEffect } from 'react'
import { FinancialDataTable } from '../financial-data-table/page' // Import the table component

interface FinancialDataSearchProps {
    onSelectData: (data: any) => void
}

export default function FinancialDataSearch({
    onSelectData,
}: FinancialDataSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selectedFilename, setSelectedFilename] = useState<string | null>(
        null
    )

    useEffect(() => {
        const fetchData = async () => {
            if (query.length > 0) {
                const response = await fetch(
                    `/api/financial-data/company-details/search?query=${query}`
                )
                const data = await response.json()
                setResults(data)
            } else {
                setResults([])
            }
        }

        fetchData()
    }, [query])

    const handleFilenameClick = async (filename: string) => {
        setSelectedFilename(filename)
        const response = await fetch(
            `/api/financial-data/company-details/${encodeURIComponent(filename)}/consolidated`
        )
        const data = await response.json()
        onSelectData(data) // Pass the selected data to the parent
    }

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setSelectedFilename(null) // Clear selected filename when query changes
                }}
                placeholder="Search filenames..."
                style={{
                    padding: '8px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            />
            <ul>
                {results.map((result: any) => (
                    <li
                        key={result.id}
                        onClick={() => handleFilenameClick(result.filename)}
                        style={{ cursor: 'pointer' }}
                    >
                        {result.filename}
                    </li>
                ))}
            </ul>
        </div>
    )
}
