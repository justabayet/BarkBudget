
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

const config = {
    type: 'line',
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
                ticks: {
                    maxTicksLimit: 10 // Set the maximum number of ticks to 10
                }
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
                beginAtZero: true,
                suggestedMax: function (scale) {
                    console.log("recompute suggested max")
                    // Get the maximum value in the data set
                    const max = Math.max(...scale.chart.data.datasets.map(dataset => {
                        let maxInt = 0
                        if (dataset.data) maxInt = Math.max(...dataset.data.map(el => el.y))
                        return maxInt
                    }))

                    // Calculate the suggested maximum by adding 10% to the max value
                    return max * 1.1;
                }
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
}

export default config