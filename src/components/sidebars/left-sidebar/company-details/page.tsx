'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './company-details.module.css'
import FinancialDataSearch from '@/components/financial-data/financialDataSearch/page'
import { Table } from '@/components/financial-data/financial-data-table/page' // Ensure this import path is correct

export const CompanyDetailsPage = () => {
    const router = useRouter()
    const quarterlyRef = useRef<HTMLDivElement>(null)
    const profitAndLossRef = useRef<HTMLDivElement>(null)
    const balanceSheetRef = useRef<HTMLDivElement>(null)
    const cashFlowRef = useRef<HTMLDivElement>(null)
    const ratiosRef = useRef<HTMLDivElement>(null)

    const [selectedData, setSelectedData] = useState<any>(null)

    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id
                    router.push(`#${sectionId}`, undefined)
                }
            })
        }

        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            threshold: 0.5,
        })

        observer.observe(quarterlyRef.current!)
        observer.observe(profitAndLossRef.current!)
        observer.observe(balanceSheetRef.current!)
        observer.observe(cashFlowRef.current!)
        observer.observe(ratiosRef.current!)

        return () => {
            observer.disconnect()
        }
    }, [router])

    return (
        <div className={styles.container}>
            <div>
                <FinancialDataSearch onSelectData={setSelectedData} />
            </div>
            <div className={styles.content}>
                <section
                    id="quarterly"
                    className={styles.section}
                    ref={quarterlyRef}
                >
                    <h2 className={styles.heading}>Quarterly</h2>
                    {selectedData && selectedData.sheets.QuarterlyResults ? (
                        <Table data={selectedData.sheets.QuarterlyResults} />
                    ) : (
                        <p className={styles.paragraph}>
                            No Quarterly Results Data
                        </p>
                    )}
                </section>
                <section
                    id="profit-loss"
                    className={styles.section}
                    ref={profitAndLossRef}
                >
                    <h2 className={styles.heading}>Profit & Loss</h2>
                    {selectedData && selectedData.sheets['Profit&Loss'] ? (
                        <Table data={selectedData.sheets['Profit&Loss']} />
                    ) : (
                        <p className={styles.paragraph}>
                            No Profit & Loss Data
                        </p>
                    )}
                </section>
                <section
                    id="balance-sheet"
                    className={styles.section}
                    ref={balanceSheetRef}
                >
                    <h2 className={styles.heading}>Balance Sheet</h2>
                    {selectedData && selectedData.sheets.BalanceSheet ? (
                        <Table data={selectedData.sheets.BalanceSheet} />
                    ) : (
                        <p className={styles.paragraph}>
                            No Balance Sheet Data
                        </p>
                    )}
                </section>
                <section
                    id="cash-flow"
                    className={styles.section}
                    ref={cashFlowRef}
                >
                    <h2 className={styles.heading}>Cash Flow</h2>
                    {selectedData && selectedData.sheets.CashFlow ? (
                        <Table data={selectedData.sheets.CashFlow} />
                    ) : (
                        <p className={styles.paragraph}>No Cash Flow Data</p>
                    )}
                </section>
                <section id="ratios" className={styles.section} ref={ratiosRef}>
                    <h2 className={styles.heading}>Ratios</h2>
                    {selectedData && selectedData.sheets.Ratios ? (
                        <Table data={selectedData.sheets.Ratios} />
                    ) : (
                        <p className={styles.paragraph}>No Ratios Data</p>
                    )}
                </section>
            </div>
        </div>
    )
}
