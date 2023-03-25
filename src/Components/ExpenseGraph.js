import React, { useEffect, useState } from "react"
import { Chart, registerables } from "chart.js"
import 'chartjs-adapter-moment'
import { useExpenses } from '../Providers/ExpensesProvider'
import { useTargets } from '../Providers/TargetsProvider'
import { useValues } from '../Providers/ValuesProvider'
import { ForecastEngine } from "../Modes/ForecastEngine"
import { OneTime } from "../Modes/OneTime"
import { useGraph } from "../Providers/GraphProvider"
import { useScenario } from "../Providers/ScenarioProvider"
import { Button } from "@mui/material"


function compare(a, b) {
  if (a.x < b.x) {
    return -1
  }
  if (a.x > b.x) {
    return 1
  }
  return 0
}

Chart.register(...registerables)

const ExpenseGraph = () => {
  const [startAmount, setStartAmount] = useState(0)
  const [startDate, setStartDate] = useState(new Date("2022-01-01"))
  const [startScenarioDate] = useState(new Date("2022-01-01"))
  const [endDate] = useState(new Date("2022-10-10"))

  const { scenarioId, scenario } = useScenario()

  const { chartRef, setCanvas, pinnedScenarios, tooglePinnedScenario } = useGraph()

  useEffect(() => {
    setCanvas(document.getElementById("expenseChart"))
  }, [setCanvas])

  
  const expenses = useExpenses().values
  const [parsedExpenses, setParsedExpenses] = useState([])

  const [engine, setEngine] = useState(new ForecastEngine(startDate, endDate, startAmount))
  useEffect(() => {
    setEngine(new ForecastEngine(startDate, endDate, startAmount))
  }, [startAmount, startDate, endDate])

  useEffect(() => {
    engine.cleanEntries()

    // Add expected expenses
    engine.addEntry(new OneTime({ date: new Date("2022-01-03"), amount: 15 }))

    engine.iterate()
    const updatedParsedExpenses = engine.values?.map(expense => {
      return {
        x: new Date(expense.date),
        y: expense.value,
      }
    })

    updatedParsedExpenses?.sort(compare)
    setParsedExpenses(updatedParsedExpenses)
  }, [expenses, engine])


  const values = useValues().values
  const [parsedValues, setParsedValues] = useState([])

  useEffect(() => {
    const updatedParsedValues = []
    
    values?.forEach(value => {
      if(value.date <= startScenarioDate) {
        updatedParsedValues.push({
          x: new Date(value.date),
          y: value.amount,
        })
      }
    })

    updatedParsedValues.sort(compare)

    if(updatedParsedValues.length > 0) {
      const lastValue = updatedParsedValues[updatedParsedValues.length - 1]
      setStartAmount(parseInt(lastValue.y))
      setStartDate(lastValue.x)
    }

    setParsedValues(updatedParsedValues)
  }, [values, startScenarioDate])


  
  const targets = useTargets().values
  const [parsedTargets, setParsedTargets] = useState([])

  useEffect(() => {
    const updatedParsedTargets = targets?.map(target => {
      return {
        x: new Date(target.date),
        y: target.amount,
      }
    })

    updatedParsedTargets?.sort(compare)
    setParsedTargets(updatedParsedTargets)
  }, [targets])




  useEffect(() => {
    if (!chartRef.current) return
    chartRef.current.data.datasets[0].data = parsedTargets
    chartRef.current.data.datasets[1].data = parsedValues
    chartRef.current.data.datasets[2].data = parsedExpenses

    chartRef.current.update()
  }, [parsedExpenses, parsedTargets, parsedValues, chartRef])


  useEffect(() => {
    if (!chartRef.current) return
    chartRef.current.data.datasets.splice(3)

    pinnedScenarios.forEach(({ scenario, data }) => {
      if (scenario.id !== scenarioId) {
        chartRef.current.data.datasets.push({
          label: scenario.name,
          data: data,
          backgroundColor: 'rgba(230, 0, 230, 0.5)',
          borderColor: 'rgba(230, 0, 230, 1)',
          borderWidth: 2,
          pointRadius: 5,
          fill: false,
        })
      }
    })

    chartRef.current.update()
  }, [pinnedScenarios, scenarioId, chartRef])

  return (
    <>
      <div>
        <canvas id="expenseChart" />
      </div>
      <Button variant="secondary"
        onClick={() => {
          tooglePinnedScenario(scenario, [...parsedValues, ...parsedExpenses])
        }}>
        Pin {scenario.name}
      </Button>
    </>
  )
}

export default ExpenseGraph