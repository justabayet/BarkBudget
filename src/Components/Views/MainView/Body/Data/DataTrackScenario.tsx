import { useEffect } from 'react'

import { useGraph, useScenario } from 'Providers'
import { useRecords } from 'Providers/GraphValuesProvider'

const DataTrackScenario = (): null => {
    const { scenario } = useScenario()
    const { pinScenario, unpinScenario } = useGraph()

    const { graphValuesUnselected } = useRecords()

    useEffect(() => {
        if (!graphValuesUnselected || !pinScenario || !unpinScenario) return

        pinScenario.current(scenario, [...graphValuesUnselected])

        const unpin = unpinScenario.current
        return () => {
            unpin(scenario)
        }
    }, [scenario, graphValuesUnselected, pinScenario, unpinScenario])

    return null
}

export default DataTrackScenario
