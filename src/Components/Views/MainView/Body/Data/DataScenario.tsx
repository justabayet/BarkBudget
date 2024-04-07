import { useEffect } from 'react'

import { useGraph, useLoadingStatus } from 'Providers'
import { useExpectations, useRecords } from 'Providers/GraphValuesProvider'


const DataScenario = (): null => {
    const { setMainExpectations, setMainRecords } = useGraph()
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

    useEffect(() => {
        setCurrentScenarioLoading(areExpectationsLoading || areRecordsLoading)
    }, [areExpectationsLoading, areRecordsLoading, setCurrentScenarioLoading])

    return null
}


export default DataScenario