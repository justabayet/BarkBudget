import React, { useEffect } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, Typography } from '@mui/material'

import { useScenarios } from 'Providers'

import HeaderScenario from './HeaderScenario'
import SelectorPinnedScenarios from './SelectorPinnedScenarios'
import SelectorScenario from './SelectorScenario'


const PanelScenario = () => {
    const { currentScenario, scenarios, addScenario, deleteScenario, cloneScenario, setScenarioId, updateScenario } = useScenarios()

    useEffect(() => {
        window.scrollTo({ top: 85 })
    }, [])

    if (!scenarios) {
        return <Typography>Error while getting scenarios</Typography>

    } else if (scenarios.length === 0) {
        return (
            <Button color='primary' onClick={addScenario}>
                Create your first scenario to get started <AddIcon />
            </Button>
        )
    } else {
        return (
            <Stack spacing={3} marginTop={4} id='stack-panel-scenario'>
                {currentScenario && (
                    <>
                        <HeaderScenario
                            scenario={currentScenario}
                            scenarios={scenarios}
                            addScenario={addScenario}
                            deleteScenario={deleteScenario}
                            updateScenario={updateScenario}
                            cloneScenario={cloneScenario} />

                        <SelectorScenario
                            currentScenario={currentScenario}
                            scenarios={scenarios}
                            setScenarioId={setScenarioId} />
                    </>
                )}

                <SelectorPinnedScenarios scenarios={scenarios} updateScenario={updateScenario} />
            </Stack>
        )
    }
}


export default PanelScenario
