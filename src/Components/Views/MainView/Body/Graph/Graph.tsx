// @ts-nocheck
import React, { useEffect, useRef } from 'react'

import { useDeviceDetails } from 'Providers/DeviceDetailsProvider'
import { useGraph } from 'Providers/GraphProvider'

import { Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-moment'

import './Graph.css'
import config from './graphConfig'

Chart.register(...registerables)

const Graph = (): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const chartRef = useRef<Chart | null>(null)

    const theme = useTheme()

    const { isMobile } = useDeviceDetails()

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


    const { mainExpectations, mainLimits, mainRecords, pinnedScenarios } = useGraph()

    useEffect(() => {
        console.log("Graph main data")
        if (!chartRef.current) return
        chartRef.current.data.datasets[0].data = mainRecords as any
        chartRef.current.data.datasets[1].data = mainLimits as any
        chartRef.current.data.datasets[2].data = mainExpectations as any
        console.log(chartRef.current?.data)
        chartRef.current.update()
    }, [mainExpectations, mainLimits, mainRecords, chartRef])


    useEffect(() => {
        console.log("Graph pinned scenarios")
        if (chartRef.current === null) return
        chartRef.current.data.datasets.splice(3)

        // TODO update only data of the dataset, not the entire dataset
        pinnedScenarios.forEach(({ scenario, data }) => {
            if (chartRef.current === null) return
            chartRef.current.data.datasets.push({
                label: scenario.name,
                data: data,
                backgroundColor: 'rgba(230, 230, 230, 0.3)',
                borderColor: 'rgba(100, 100, 100, 0.5)',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
            })
        })

        chartRef.current.update()
    }, [pinnedScenarios, chartRef])

    useEffect(() => {
        if (chartRef.current === null) return

        if (isMobile) {
            chartRef.current.options.scales.x.ticks.display = false
            chartRef.current.options.scales.y.ticks.display = false
        } else {
            chartRef.current.options.scales.x.ticks.display = true
            chartRef.current.options.scales.y.ticks.display = true
        }
        chartRef.current.update()
    }, [isMobile])

    useEffect(() => {
        if (chartRef.current === null) return

        chartRef.current.options.scales.x.grid.color = theme.grid.line
        chartRef.current.options.scales.y.grid.color = theme.grid.line

        chartRef.current.options.scales.x.ticks.color = theme.palette.text.disabled
        chartRef.current.options.scales.y.ticks.color = theme.palette.text.disabled

        chartRef.current.options.scales.x.border.color = theme.grid.line
        chartRef.current.options.scales.y.border.color = theme.grid.line

        chartRef.current.update()
    }, [theme])

    /**
     * Way to keep the graph on top of the dialog: 
        <div className="graphBox" style={{ zIndex: theme.zIndex.modal + 1 }}>
            <canvas ref={canvasRef} id="expectationChart" />
        </div>
     */

    return (
        <Container className="graphBox" disableGutters sx={{
            '&::before': {
                backgroundColor: theme.palette.background.default
            }
        }}>
            <canvas ref={canvasRef} id="expectationChart" />
        </Container>
    )
}

export default Graph