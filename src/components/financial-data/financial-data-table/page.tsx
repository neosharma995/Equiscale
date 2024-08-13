import React from 'react'
import { formatData } from '@/utils/formatter/formatter' // Adjust the path as needed

interface FinancialDataConsolidated {
    id: string
    filename: string
    sheets: {
        QuarterlyResults?: any[]
        ProfitAndLoss?: any[]
        BalanceSheet?: any[]
        CashFlow?: any[]
        Ratios?: any[]
    }
}

interface SectionProps {
    title: string
    data?: any[]
}

const Section: React.FC<SectionProps> = ({ title, data }) => {
    if (!data || data.length === 0) return null

    return (
        <div>
            <h2>{title}</h2>
            <Table data={data} />
        </div>
    )
}

export const FinancialDataTable: React.FC<{
    data: FinancialDataConsolidated
}> = ({ data }) => {
    return (
        <div>
            <h1>Financial Data for {data.filename}</h1>
            <Section
                title="Quarterly Results"
                data={data.sheets.QuarterlyResults}
            />
            <Section title="Profit & Loss" data={data.sheets.ProfitAndLoss} />
            <Section title="Balance Sheet" data={data.sheets.BalanceSheet} />
            <Section title="Cash Flow" data={data.sheets.CashFlow} />
            <Section title="Ratios" data={data.sheets.Ratios} />
        </div>
    )
}

interface TableProps {
    data: Record<string, any>[]
}

export const Table: React.FC<TableProps> = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>

    // Format data here before rendering
    const formattedData = formatData(data)

    return (
        <table>
            <thead>
                <tr>
                    {Object.keys(formattedData[0]).map((key) => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {formattedData.map((item, index) => (
                    <tr key={index}>
                        {Object.values(item).map((value, idx) => (
                            <td key={idx}>{String(value)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
