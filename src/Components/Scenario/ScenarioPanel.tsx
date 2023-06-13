
import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, Typography } from "@mui/material"
import React from "react"
import { useScenarios } from '../../Providers/ScenariosProvider'
import PinnedScenariosSelector from './PinnedScenariosSelector'
import ScenarioHeader from './ScenarioHeader'
import ScenarioSelector from './ScenarioSelector'



const ScenarioPanel = () => {
    const { currentScenario, scenarios, addScenario, deleteScenario, setScenarioId, updateScenario } = useScenarios()

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
            <Stack spacing={3} marginTop={3}>
                {currentScenario && <ScenarioHeader scenario={currentScenario} scenarios={scenarios} addScenario={addScenario} deleteScenario={deleteScenario} updateScenario={updateScenario} />}

                <PinnedScenariosSelector scenarios={scenarios} updateScenario={updateScenario} />

                {currentScenario && <ScenarioSelector currentScenario={currentScenario} scenarios={scenarios} setScenarioId={setScenarioId} />}
            </Stack>
        )
    }
}

export default ScenarioPanel