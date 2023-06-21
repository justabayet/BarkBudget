import React, { useEffect } from 'react'
import { useGraph } from "../../Providers/GraphProvider"
import { useExpectations } from '../../Providers/GraphValuesProvider/ExpectationsProvider'
import { useRecords } from '../../Providers/GraphValuesProvider/RecordsProvider'
import { useScenario } from "../../Providers/ScenarioProvider"


const DataPinnedScenario = (): JSX.Element => {
    const { scenario } = useScenario()
    const { pinScenario, unpinScenario } = useGraph()

    const graphExpectations = useExpectations().graphValues
    const graphRecords = useRecords().graphValues


    useEffect(() => {
        if (!graphRecords || !graphExpectations || !pinScenario || !unpinScenario) return
        pinScenario.current(scenario, [...graphRecords, ...graphExpectations])

        const unpin = unpinScenario.current
        return () => {
            unpin(scenario)
        }

    }, [scenario, graphExpectations, graphRecords, pinScenario, unpinScenario])

    return <></>
}

export default DataPinnedScenario


