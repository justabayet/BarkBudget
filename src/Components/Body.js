import React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useScenarios } from '../Providers/ScenariosProvider'
import { ScenarioProvider } from '../Providers/ScenarioProvider'
import DataPinnedScenario from './DataPinnedScenario'
import Graph from './Graph'
import PinnedScenariosSelector from './PinnedScenariosSelector'
import ScenarioSelector from './ScenarioSelector'
import ScenarioHeader from './ScenarioHeader'
import DataScenario from './DataScenario'
import TransactionDashboard from './TransactionDashboard'
import AddIcon from '@mui/icons-material/Add'

const Body = () => {
    const { currentScenario, scenarios, addScenario } = useScenarios()

    if (!scenarios) {
        return (
            <Typography>Error while getting scenarios</Typography>
        )
    }

    if (scenarios.length === 0) {
        return (
            <Button color="primary" onClick={addScenario}>
                Create your first scenario to get started <AddIcon />
            </Button>
        )
    } else {
        return (
            <Stack spacing={2}>

                {currentScenario && <ScenarioHeader />}
                {currentScenario && <ScenarioSelector />}

                <Graph />

                <PinnedScenariosSelector />


                {scenarios.map(scenario => {
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
                })}
            </Stack>
        )
    }


}

export default Body