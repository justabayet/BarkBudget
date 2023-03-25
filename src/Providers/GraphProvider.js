
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
    constructor(chartRef, setCanvas, tooglePinnedScenario, pinnedScenarios) {
        this.chartRef = chartRef
        this.setCanvas = setCanvas
        this.tooglePinnedScenario = tooglePinnedScenario
        this.pinnedScenarios = pinnedScenarios
    }
}

const GraphContext = createContext(new Graph(undefined, () => { }, () => { }, undefined))

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
        console.log("GraphProvider tooglePinnedScenario")
        const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
        if (index === -1) {
            pinnedScenarios.push({ scenario, data })
        } else {
            pinnedScenarios.splice(index, 1)
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
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Target',
                        data: [],
                        backgroundColor: 'rgba(230, 0, 230, 0.5)',
                        borderColor: 'rgba(230, 0, 230, 1)',
                        borderWidth: 2,
                        pointRadius: 5,
                        fill: false,
                    },
                    {
                        label: 'Value',
                        data: [],
                        backgroundColor: 'rgba(230, 230, 0, 0.5)',
                        borderColor: 'rgba(230, 230, 0, 1)',
                        borderWidth: 2,
                        pointRadius: 5,
                        fill: false,
                    },
                    {
                        label: 'Expense',
                        data: [],
                        backgroundColor: 'rgba(100, 0, 230, 0.5)',
                        borderColor: 'rgba(100, 0, 230, 1)',
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
    }, [canvas, chartRef])

    return (
        <GraphContext.Provider
            value={(new Graph(chartRef, setCanvas, tooglePinnedScenario, pinnedScenarios))}
        >
            {props.children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}