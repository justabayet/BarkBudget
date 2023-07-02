import React from 'react'

import { useScenarios } from 'Providers/ScenariosProvider'

import ScenariosEmpty from './ScenariosEmpty'
import ScenariosList from './ScenariosList'
import ScenariosNotFound from './ScenariosNotFound'


const Body = (): JSX.Element => {
    const { scenarios } = useScenarios()

    if (!scenarios) {
        return <ScenariosNotFound />

    } else if (scenarios.length === 0) {
        return <ScenariosEmpty />

    } else {
        return <ScenariosList scenarios={scenarios} />
    }
}


export default Body