// Function to format numbers with conditional decimal places
export function formatToConditionalDecimalPoints(value: number): string {
    const formattedValue = value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    return formattedValue.replace(/\.00$/, '') // Remove trailing .00
}

// Function to format data for table rendering
export function formatData(data: Record<string, any>[]): Record<string, any>[] {
    return data.map((item) => {
        const newItem = { ...item }
        Object.keys(newItem).forEach((key) => {
            if (typeof newItem[key] === 'number') {
                newItem[key] = formatToConditionalDecimalPoints(newItem[key])
            }
        })
        return newItem
    })
}
