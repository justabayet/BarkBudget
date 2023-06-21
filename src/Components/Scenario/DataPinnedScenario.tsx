import React, { useEffect } from 'react'
import { useGraph } from "../../Providers/GraphProvider"
import { useExpectations } from '../../Providers/GraphValuesProvider/ExpectationsProvider'
import { useValues } from '../../Providers/GraphValuesProvider/ValuesProvider'
import { useScenario } from "../../Providers/ScenarioProvider"


const DataPinnedScenario = (): JSX.Element => {
    const { scenario } = useScenario()
    const { pinScenario, unpinScenario } = useGraph()

    const graphExpectations = useExpectations().graphValues
    const graphValues = useValues().graphValues


    useEffect(() => {
        if (!graphValues || !graphExpectations || !pinScenario || !unpinScenario) return
        pinScenario.current(scenario, [...graphValues, ...graphExpectations])

        const unpin = unpinScenario.current
        return () => {
            unpin(scenario)
        }

    }, [scenario, graphExpectations, graphValues, pinScenario, unpinScenario])

    return <></>
}

export default DataPinnedScenario


