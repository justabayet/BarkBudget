import React, { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import 'chartjs-adapter-moment'
import { useExpenses } from '../Providers/ExpensesProvider'
import { useTargets } from '../Providers/TargetsProvider'
import { useValues } from '../Providers/ValuesProvider'
import { ForecastEngine } from "../Modes/ForecastEngine"
import { OneTime } from "../Modes/OneTime"

      
function compare( a, b ) {
  if ( a.x < b.x ){
    return -1
  }
  if ( a.x > b.x ){
    return 1
  }
  return 0
}

Chart.register(...registerables)

const ExpenseGraph = () => {
  const chartRef = useRef(null)

  const useExp = useExpenses()
  const expenses = useExp.values
  const [parsedExpenses, setParsedExpenses] = useState([])

  const [startAmount, setStartAmount] = useState(0)
  const [startDate, setStartDate] = useState("2022-01-01")
  const [endDate, setEndDate] = useState("2022-10-10")

  const engineRef = useRef(new ForecastEngine(new Date(startDate), new Date(endDate), startAmount))

  useEffect(() => {
    engineRef.current = new ForecastEngine(new Date(startDate), new Date(endDate), startAmount)
  }, [startAmount, startDate, endDate])

  const useVal = useValues()
  const values = useVal.values
  const [parsedValues, setParsedValues] = useState([])

  const useTarg = useTargets()
  const targets = useTarg.values
  const [parsedTargets, setParsedTargets] = useState([])

  useEffect(() => {
    const engine = engineRef.current

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
  }, [expenses, engineRef.current])
  
  useEffect(() => {
    const updatedParsedValues = values?.map(value => {
      return {
        x: new Date(value.date),
        y: value.amount,
      }
    })
      
    updatedParsedValues?.sort(compare)
    setParsedValues(updatedParsedValues)
  }, [values])
  
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
    let ctx = document.getElementById("expenseChart").getContext("2d")
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
  }, [])

  useEffect(() => {
    if(!chartRef.current) return
    chartRef.current.data.datasets[0].data = parsedTargets
    chartRef.current.data.datasets[1].data = parsedValues
    chartRef.current.data.datasets[2].data = parsedExpenses
    chartRef.current.update()
  }, [parsedExpenses, parsedTargets, parsedValues])

  return (
    <div>
      <canvas id="expenseChart" />
    </div>
  )
}

export default ExpenseGraph