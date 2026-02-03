'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function StatusChart({ data }) {
  const chartData = {
    labels: ['Applied', 'Interview', 'Rejected', 'Offer'],
    datasets: [
      {
        data: [data?.Applied || 0, data?.Interview || 0, data?.Rejected || 0, data?.Offer || 0],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'],
        hoverOffset: 6,
      },
    ],
  }

  return <Doughnut data={chartData} />
}
