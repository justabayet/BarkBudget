import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { ScenarioProvider } from '../Providers/ScenarioProvider'
import { useScenarios } from '../Providers/ScenariosProvider'
import Graph from './Graph'
import DataPinnedScenario from './Scenario/DataPinnedScenario'
import DataScenario from './Scenario/DataScenario'
import TransactionDashboard from './Transaction/TransactionDashboard'

const Body = (): JSX.Element => {
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
            <Stack>
                <Graph />

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