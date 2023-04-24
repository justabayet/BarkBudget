import React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useScenarios } from '../Providers/ScenariosProvider'
import { ScenarioProvider } from '../Providers/ScenarioProvider'
import DataPinnedScenario from './Scenario/DataPinnedScenario'
import Graph from './Graph'
import PinnedScenariosSelector from './Scenario/PinnedScenariosSelector'
import ScenarioSelector from './Scenario/ScenarioSelector'
import ScenarioHeader from './Scenario/ScenarioHeader'
import DataScenario from './Scenario/DataScenario'
import TransactionDashboard from './Transaction/TransactionDashboard'
import AddIcon from '@mui/icons-material/Add'

const Body = (): JSX.Element => {
    const { currentScenario, scenarios, addScenario, deleteScenario, updateScenario, setScenarioId } = useScenarios()

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

                {currentScenario && <ScenarioHeader scenario={currentScenario} scenarios={scenarios} addScenario={addScenario} deleteScenario={deleteScenario} updateScenario={updateScenario} />}
                {currentScenario && <ScenarioSelector currentScenario={currentScenario} scenarios={scenarios} setScenarioId={setScenarioId} />}

                <Graph />

                <PinnedScenariosSelector scenarios={scenarios} updateScenario={updateScenario} />


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