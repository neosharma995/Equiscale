import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
    labels: string[] // e.g., ['2024', '2025', ...]
    data: number[] // e.g., [100, 200, 300, ...]
}

const BarChartComponent: React.FC<BarChartProps> = ({ labels, data }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Number of Users',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Users: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Year',
                },
                ticks: {
                    autoSkip: true,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Users',
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 50, // Adjust step size as needed
                },
            },
        },
    }

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default BarChartComponent
