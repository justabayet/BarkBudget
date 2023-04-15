import { useEffect } from "react"
import { useExpenses } from '../../Providers/GraphValuesProvider/ExpensesProvider'
import { useValues } from '../../Providers/GraphValuesProvider/ValuesProvider'
import { useGraph } from "../../Providers/GraphProvider"
import { useLimits } from "../../Providers/GraphValuesProvider/LimitsProvider"

const DataScenario = () => {
  const { setMainExpenses, setMainLimits, setMainValues } = useGraph()

  const graphExpenses = useExpenses().graphValues
  useEffect(() => {
    console.log("DataScenario set graphExpenses")
    setMainExpenses(graphExpenses)
  }, [graphExpenses, setMainExpenses])

  const graphValues = useValues().graphValues
  useEffect(() => {
    console.log("DataScenario set graphValues")
    setMainValues(graphValues)
  }, [graphValues, setMainValues])

  const graphLimits = useLimits().graphValues
  useEffect(() => {
    console.log("DataScenario set graphLimits")
    setMainLimits(graphLimits)
  }, [graphLimits, setMainLimits])
}

export default DataScenario