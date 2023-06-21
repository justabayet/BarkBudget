import React, { useEffect } from 'react'
import { useGraph } from "../../Providers/GraphProvider"
import { useExpectations } from '../../Providers/GraphValuesProvider/ExpectationsProvider'
import { useLimits } from "../../Providers/GraphValuesProvider/LimitsProvider"
import { useRecords } from '../../Providers/GraphValuesProvider/RecordsProvider'

const DataScenario = (): JSX.Element => {
    const { setMainExpectations, setMainLimits, setMainRecords } = useGraph()

    const graphExpectations = useExpectations().graphValues
    useEffect(() => {
        console.log("DataScenario set graphExpectations")
        setMainExpectations(graphExpectations || [])
    }, [graphExpectations, setMainExpectations])

    const graphRecords = useRecords().graphValues
    useEffect(() => {
        console.log("DataScenario set graphValues")
        setMainRecords(graphRecords || [])
    }, [graphRecords, setMainRecords])

    const graphLimits = useLimits().graphValues
    useEffect(() => {
        console.log("DataScenario set graphLimits")
        setMainLimits(graphLimits || [])
    }, [graphLimits, setMainLimits])

    return <></>
}

export default DataScenario