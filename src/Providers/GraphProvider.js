
import { Chart } from "chart.js"
import { createContext, useContext, useEffect, useRef, useState } from "react"

export function compareGraphValues(a, b) {
    if (a.x < b.x) {
        return -1
    }
    if (a.x > b.x) {
        return 1
    }
    return 0
}

class Graph {
    constructor(chartRef, setCanvas, tooglePinnedScenario, pinScenario, pinnedScenarios) {
        this.chartRef = chartRef
        this.setCanvas = setCanvas
        this.tooglePinnedScenario = tooglePinnedScenario
        this.pinScenario = pinScenario
        this.pinnedScenarios = pinnedScenarios
    }
}

const GraphContext = createContext(new Graph(undefined, () => { }, () => { }, () => { }, undefined))

export const GraphProvider = (props) => {
    const chartRef = useRef(null)

    /* 
    [
        {
            scenario: {},
            data: [] // Ready to be attached to the graph
        }, 
        ...
    ]
    */
    const [pinnedScenarios, setPinnedScenarios] = useState([])

    const tooglePinnedScenario = (scenario, data) => {
        const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
        if (index === -1) {
            console.log("GraphProvider tooglePinnedScenario", true)
            pinnedScenarios.push({ scenario, data })
        } else {
            console.log("GraphProvider tooglePinnedScenario", false)
            pinnedScenarios.splice(index, 1)
        }
        setPinnedScenarios([...pinnedScenarios])
    }

    const pinScenario = (scenario, data) => {
        const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
        if (index === -1) {
            console.log("GraphProvider pinScenario", true)
            pinnedScenarios.push({ scenario, data })
        } else {
            console.log("GraphProvider pinScenario", false)
            pinnedScenarios.splice(index, 1)
            pinnedScenarios.push({ scenario, data })
        }
        setPinnedScenarios([...pinnedScenarios])
    }

    const [canvas, setCanvas] = useState(null)

    useEffect(() => {
        if (!canvas) return
        let ctx = canvas.getContext("2d")
        if (chartRef.current) {
            chartRef.current.destroy()
        }
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
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Target',
                        data: [],
                        backgroundColor: `rgba(${colorTarget}, 0.2)`,
                        borderColor: `rgba(${colorTarget}, 1)`,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                    },
                    {
                        label: 'Value',
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
                            console.log("recompute")
                            // Get the maximum value in the data set
                            const max = Math.max(...scale.chart.data.datasets.map(dataset => {
                                const maxInt = Math.max(...dataset.data.map(el => el.y))
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
        })
    }, [canvas, chartRef])

    return (
        <GraphContext.Provider
            value={(new Graph(chartRef, setCanvas, tooglePinnedScenario, pinScenario, pinnedScenarios))}
        >
            {props.children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}