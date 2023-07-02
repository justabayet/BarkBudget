import { useEffect } from 'react'

import { useGraph, useScenario } from 'Providers'
import { useExpectations, useRecords } from 'Providers/GraphValuesProvider'

const DataPinnedScenario = (): null => {
    const { scenario } = useScenario()
    const { pinScenario, unpinScenario } = useGraph()

    const { graphValues: graphExpectations } = useExpectations()
    const { graphValues: graphRecords } = useRecords()

    useEffect(() => {
        if (!graphRecords || !graphExpectations || !pinScenario || !unpinScenario) return

        pinScenario.current(scenario, [...graphRecords, ...graphExpectations])

        const unpin = unpinScenario.current
        return () => {
            unpin(scenario)
        }
    }, [scenario, graphExpectations, graphRecords, pinScenario, unpinScenario])

    return null
}


export default DataPinnedScenario


