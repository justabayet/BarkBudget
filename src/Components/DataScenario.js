import { useEffect } from "react"
import { useExpenses } from '../Providers/GraphValuesProvider/ExpensesProvider'
import { useTargets } from '../Providers/GraphValuesProvider/TargetsProvider'
import { useValues } from '../Providers/GraphValuesProvider/ValuesProvider'
import { useGraph } from "../Providers/GraphProvider"

const DataScenario = () => {
  const { setMainExpenses, setMainTargets, setMainValues } = useGraph()

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

  const graphTargets = useTargets().graphValues
  useEffect(() => {
    console.log("DataScenario set graphTargets")
    setMainTargets(graphTargets)
  }, [graphTargets, setMainTargets])
}

export default DataScenario