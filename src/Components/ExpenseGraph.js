import React, { useEffect } from "react"
import { Chart, registerables } from "chart.js"
import 'chartjs-adapter-moment'
import { useExpenses } from '../Providers/GraphValuesProvider/ExpensesProvider'
import { useTargets } from '../Providers/GraphValuesProvider/TargetsProvider'
import { useValues } from '../Providers/GraphValuesProvider/ValuesProvider'
import { useLimits } from '../Providers/GraphValuesProvider/LimitsProvider'
import { useGraph } from "../Providers/GraphProvider"
import { useScenario } from "../Providers/ScenarioProvider"
import { Button } from "@mui/material"

Chart.register(...registerables)

const ExpenseGraph = () => {
  const { scenarioId, scenario } = useScenario()

  const { chartRef, setCanvas, pinnedScenarios, tooglePinnedScenario, pinScenario } = useGraph()

  useEffect(() => {
    setCanvas(document.getElementById("expenseChart"))
  }, [setCanvas])


  const graphExpenses = useExpenses().graphValues
  const graphValues = useValues().graphValues
  const graphTargets = useTargets().graphValues


  useEffect(() => {
    if (!chartRef.current) return
    chartRef.current.data.datasets[0].data = graphTargets
    chartRef.current.data.datasets[1].data = graphValues
    chartRef.current.data.datasets[2].data = graphExpenses

    chartRef.current.update()
  }, [graphExpenses, graphTargets, chartRef])


  useEffect(() => {
    if (!chartRef.current) return
    chartRef.current.data.datasets.splice(3)

    // TODO update only data of the dataset, not the entire dataset to have better animation
    pinnedScenarios.forEach(({ scenario, data }) => {
      if (scenario.id !== scenarioId) {
        chartRef.current.data.datasets.push({
          label: scenario.name,
          data: data,
          backgroundColor: 'rgba(100, 100, 100, 0.5)',
          borderColor: 'rgba(100, 100, 100, 0.7)',
          borderWidth: 1,
          pointRadius: 0,
          fill: true,
        })
      }
    })

    chartRef.current.update()
  }, [pinnedScenarios, scenarioId, chartRef])


  useEffect(() => {
    if (scenario.isPinned) {
      pinScenario(scenario, [...graphValues, ...graphExpenses])
    }

  }, [scenario, graphExpenses])

  return (
    <>
      <div>
        <canvas id="expenseChart" />
      </div>
      <Button variant="secondary"
        onClick={() => {
          tooglePinnedScenario(scenario, [...graphValues, ...graphExpenses])
        }}>
        Pin {scenario.name}
      </Button>
    </>
  )
}

export default ExpenseGraph