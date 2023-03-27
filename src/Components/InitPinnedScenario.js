import { useExpenses } from '../Providers/GraphValuesProvider/ExpensesProvider'
import { useValues } from '../Providers/GraphValuesProvider/ValuesProvider'
import { useGraph } from "../Providers/GraphProvider"
import { useScenario } from "../Providers/ScenarioProvider"
import { useEffect } from 'react'


const InitPinnedScenario = () => {
    const { scenario } = useScenario()
    const { pinScenario } = useGraph()

    const graphExpenses = useExpenses().graphValues
    const graphValues = useValues().graphValues


    useEffect(() => {
        pinScenario(scenario, [...graphValues, ...graphExpenses])

    }, [scenario, graphExpenses, graphValues])

    return undefined
}

export default InitPinnedScenario