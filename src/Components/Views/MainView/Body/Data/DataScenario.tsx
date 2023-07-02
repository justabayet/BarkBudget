import { useEffect } from 'react'

import { useGraph, useLoadingStatus } from 'Providers'
import { useExpectations, useLimits, useRecords } from 'Providers/GraphValuesProvider'


const DataScenario = (): null => {
    const { setMainExpectations, setMainLimits, setMainRecords } = useGraph()
    const { setCurrentScenarioLoading } = useLoadingStatus()

    const { graphValues: graphExpectations, isLoading: areExpectationsLoading } = useExpectations()
    useEffect(() => {
        console.log("DataScenario set graphExpectations")
        setMainExpectations(graphExpectations || [])
    }, [graphExpectations, setMainExpectations])

    const { graphValues: graphRecords, isLoading: areRecordsLoading } = useRecords()
    useEffect(() => {
        console.log("DataScenario set graphValues")
        setMainRecords(graphRecords || [])
    }, [graphRecords, setMainRecords])

    const { graphValues: graphLimits, isLoading: areLimitsLoading } = useLimits()
    useEffect(() => {
        console.log("DataScenario set graphLimits")
        setMainLimits(graphLimits || [])
    }, [graphLimits, setMainLimits])

    useEffect(() => {
        setCurrentScenarioLoading(areExpectationsLoading || areRecordsLoading || areLimitsLoading)
    }, [areExpectationsLoading, areLimitsLoading, areRecordsLoading, setCurrentScenarioLoading])

    return null
}


export default DataScenario