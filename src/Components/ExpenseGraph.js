import React, { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import 'chartjs-adapter-moment'

Chart.register(...registerables)
const ExpenseGraph = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = () => {
      let ctx = document.getElementById("expenseChart").getContext("2d")
      if (chartRef.current) {
        chartRef.current.destroy()
      }

      const parsedData = data.map((entry) => {
        return {
          x: new Date(entry.date),
          y: entry.amount,
        }
      })

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Amount',
              data: parsedData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: false,
          },
          scales: {
            x: {
              gridLines: {
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 1,
              },
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM YYYY',
                },
              },
            },
            y:
            {
              ticks: {
                callback: function (value, index, values) {
                  return value + '€'
                },
              },
              gridLines: {
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 1,
              },
              beginAtZero: true
            },
          },
          hover: {
            mode: 'x',
            intersect: false,
          },
          interaction: {
            mode: 'x',
            intersect: false,
          },
          tooltips: {
            mode: 'x',
            intersect: false,
          },
        },
      })
    }

    chart()
  }, [data])

  return (
    <div>
      <canvas id="expenseChart" />
    </div>
  )
}

export default ExpenseGraph