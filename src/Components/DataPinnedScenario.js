import { useExpenses } from '../Providers/GraphValuesProvider/ExpensesProvider'
import { useValues } from '../Providers/GraphValuesProvider/ValuesProvider'
import { useGraph } from "../Providers/GraphProvider"
import { useScenario } from "../Providers/ScenarioProvider"
import { useEffect } from 'react'


const DataPinnedScenario = () => {
    const { scenario } = useScenario()
    const { pinScenario } = useGraph()

    const graphExpenses = useExpenses().graphValues
    const graphValues = useValues().graphValues


    useEffect(() => {
        if (!graphExpenses || !graphExpenses) return
        pinScenario.current(scenario, [...graphValues, ...graphExpenses])

    }, [scenario, graphExpenses, graphValues, pinScenario])
}

export default DataPinnedScenario


