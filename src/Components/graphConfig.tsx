// @ts-nocheck
import { ChartConfiguration, ChartOptions, Tick } from 'chart.js';
import { GraphValue } from "../Providers/GraphProvider";

const colorExpense = '132, 94, 194'
const colorValue = '214, 93, 177'
const colorTarget = '255, 111, 145'
/**
    #845EC2 : rgba(132, 94, 194, 1)
    #D65DB1 : rgba(214, 93, 177, 1)
    #FF6F91 : rgba(255, 111, 145, 1)
    #FF9671 : rgba(255, 150, 113, 1)
    #FFC75F : rgba(255, 199, 95, 1)
    #F9F871 : rgba(249, 248, 113, 1)
 */
const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        }

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
                    month: 'MM',
                },
            },
            ticks: {
                display: false,
                maxTicksLimit: 10 // Set the maximum number of ticks to 10
            }
        },
        y:
        {
            ticks: {
                callback: function (value: string | number, index: number, values: Tick[]) {
                    value = parseInt(value)

                    if (value >= 1000000000) {
                        value = (value / 1000000000).toFixed(0) + 'M';
                    } else if (value >= 1000000) {
                        value = (value / 1000000).toFixed(0) + 'm';
                    } else if (value >= 1000) {
                        value = (value / 1000).toFixed(0) + 'k';
                    }
                    return value
                },
                display: false
            },
            gridLines: {
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 1,
            },
            beginAtZero: true,
            suggestedMax: function (scale: { chart: { data: { datasets: { data: GraphValue[] }[] } } }) {
                console.log("recompute suggested max")
                // Get the maximum value in the data set
                const max = Math.max(...scale.chart.data.datasets.map((dataset: { data: GraphValue[] }) => {
                    let maxInt = 0
                    if (dataset.data) maxInt = Math.max(...dataset.data.map((el: GraphValue) => el.y))
                    return maxInt
                }))

                // Calculate the suggested maximum by adding 10% to the max value
                return max * 1.1;
            }
        },
    },
    hover: {
        mode: 'nearest',
        intersect: false,
    },
    interaction: {
        mode: 'nearest',
        intersect: false,
    },
    tooltips: {
        mode: 'nearest',
        intersect: false,
    },
    maintainAspectRatio: false,
}

const config: ChartConfiguration<"line"> = {
    type: "line",
    data: {
        datasets: [
            {
                label: 'Value',
                data: [],
                backgroundColor: `rgba(${colorTarget}, 0.2)`,
                borderColor: `rgba(${colorTarget}, 1)`,
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
            },
            {
                label: 'Limit',
                data: [],
                backgroundColor: `rgba(${colorValue}, 0.2)`,
                borderColor: `rgba(${colorValue}, 1)`,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
            },
            {
                label: 'Expense',
                data: [],
                backgroundColor: `rgba(${colorExpense}, 0.2)`,
                borderColor: `rgba(${colorExpense}, 1)`,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
            },
        ],
    },
    options,
}

export default config