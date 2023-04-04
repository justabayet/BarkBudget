import React from 'react'
import { Stack, Typography } from '@mui/material'
import { useScenarios } from '../Providers/ScenariosProvider'
import { ScenarioProvider } from '../Providers/ScenarioProvider'
import DataPinnedScenario from './DataPinnedScenario'
import Graph from './Graph'
import PinnedScenariosSelector from './PinnedScenariosSelector'
import ScenarioSelector from './ScenarioSelector'
import ScenarioHeader from './ScenarioHeader'
import DataScenario from './DataScenario'
import TransactionDashboard from './TransactionDashboard'

const Body = () => {
    const { currentScenario, scenarios } = useScenarios()

    if (!scenarios) {
        return (
            <Typography>Error while getting scenarios</Typography>
        )
    }

    return (
        <Stack spacing={3}>

            {currentScenario && <ScenarioHeader />}
            {currentScenario && <ScenarioSelector />}

            <Graph />

            <PinnedScenariosSelector />


            {scenarios.length > 0 ? (
                scenarios.map(scenario => {
                    let body = null
                    if (currentScenario && scenario.id === currentScenario.id) {
                        body = (
                            <>
                                <DataScenario />
                                <TransactionDashboard />
                            </>
                        )
                    } else if (scenario.isPinned) {
                        body = (<DataPinnedScenario />)
                    }
                    return (
                        <ScenarioProvider scenario={scenario} key={scenario.id}>
                            {body}
                        </ScenarioProvider>
                    )
                })
            ) : (
                <Typography>Create your first scenario to get started</Typography>
            )}
        </Stack>
    )
}

export default Body