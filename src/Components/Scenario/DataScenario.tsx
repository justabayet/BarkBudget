import React, { useEffect } from 'react'
import { useGraph } from "../../Providers/GraphProvider"
import { useExpenses } from '../../Providers/GraphValuesProvider/ExpensesProvider'
import { useLimits } from "../../Providers/GraphValuesProvider/LimitsProvider"
import { useValues } from '../../Providers/GraphValuesProvider/ValuesProvider'

const DataScenario = (): JSX.Element => {
    const { setMainExpenses, setMainLimits, setMainValues } = useGraph()

    const graphExpenses = useExpenses().graphValues
    useEffect(() => {
        console.log("DataScenario set graphExpenses")
        setMainExpenses(graphExpenses || [])
    }, [graphExpenses, setMainExpenses])

    const graphValues = useValues().graphValues
    useEffect(() => {
        console.log("DataScenario set graphValues")
        setMainValues(graphValues || [])
    }, [graphValues, setMainValues])

    const graphLimits = useLimits().graphValues
    useEffect(() => {
        console.log("DataScenario set graphLimits")
        setMainLimits(graphLimits || [])
    }, [graphLimits, setMainLimits])

    return <></>
}

export default DataScenario