import React, { useEffect, useRef, useState } from "react"
import { useGraph } from "../Providers/GraphProvider"

import { Chart, registerables } from "chart.js"
import 'chartjs-adapter-moment'
import './Graph.css'
import config from "./graphConfig"

Chart.register(...registerables)

const Graph = (): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const chartRef = useRef<Chart | null>(null)

    useEffect(() => {
        console.log("graph reset")
        if (canvasRef.current === null) {
            return
        }
        const chart = Chart.getChart(canvasRef.current.id)
        if (chart) {
            chart.destroy()
        }
        chartRef.current = new Chart(canvasRef.current, config)
    }, [canvasRef, chartRef])


    const { mainExpenses, mainLimits, mainValues, pinnedScenarios } = useGraph()

    useEffect(() => {
        console.log("Graph main data")
        if (!chartRef.current) return
        chartRef.current.data.datasets[0].data = mainValues as any
        chartRef.current.data.datasets[1].data = mainLimits as any
        chartRef.current.data.datasets[2].data = mainExpenses as any
        console.log(chartRef.current?.data)
        chartRef.current.update()
    }, [mainExpenses, mainLimits, mainValues, chartRef])


    useEffect(() => {
        console.log("Graph pinned scenarios")
        if (chartRef.current === null) return
        chartRef.current.data.datasets.splice(3)

        // TODO update only data of the dataset, not the entire dataset
        pinnedScenarios.forEach(({ scenario, data }) => {
            if (chartRef.current === null) return
            chartRef.current.data.datasets.push({
                label: scenario.name,
                data: data as any,
                backgroundColor: 'rgba(230, 230, 230, 0.3)',
                borderColor: 'rgba(100, 100, 100, 0.5)',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
            })
        })

        chartRef.current.update()
    }, [pinnedScenarios, chartRef])

    const [isMobile, setIsMobile] = useState(false)

    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 720) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    useEffect(() => {
        if (chartRef.current === null) return

        if (isMobile) {
            console.log(chartRef.current.options.scales?.x)
        } else {

        }
        chartRef.current.update()

    }, [isMobile])

    return (
        <div className="graphBox">
            <canvas ref={canvasRef} id="expenseChart" />
        </div>
    )
}

export default Graph