import React, { useEffect } from 'react'
import { useGraph } from "../../Providers/GraphProvider"
import { useExpectations } from '../../Providers/GraphValuesProvider/ExpectationsProvider'
import { useLimits } from "../../Providers/GraphValuesProvider/LimitsProvider"
import { useRecords } from '../../Providers/GraphValuesProvider/RecordsProvider'
import { useLoadingStatus } from '../../Providers/LoadingStatusProvider'

const DataScenario = (): JSX.Element => {
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

    return <></>
}

export default DataScenario