import React, { useEffect } from 'react'
import { useGraph } from "../../Providers/GraphProvider"
import { useExpectations } from '../../Providers/GraphValuesProvider/ExpectationsProvider'
import { useLimits } from "../../Providers/GraphValuesProvider/LimitsProvider"
import { useValues } from '../../Providers/GraphValuesProvider/ValuesProvider'

const DataScenario = (): JSX.Element => {
    const { setMainExpectations, setMainLimits, setMainValues } = useGraph()

    const graphExpectations = useExpectations().graphValues
    useEffect(() => {
        console.log("DataScenario set graphExpectations")
        setMainExpectations(graphExpectations || [])
    }, [graphExpectations, setMainExpectations])

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