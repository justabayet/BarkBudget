import React from 'react'
import { Typography } from '@mui/material'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import { useScenarios } from '../Providers/ScenariosProvider'
import MainHeader from './MainHeader'
import ScenarioView from './ScenarioView'
import { ScenarioProvider } from '../Providers/ScenarioProvider'

const MainView = () => {
    const { user } = useAuthentication()
    const { currentScenario } = useScenarios()

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <MainHeader />

            {user && currentScenario
                ?
                <ScenarioProvider scenario={currentScenario}>
                    <ScenarioView />
                </ScenarioProvider>

                : <Typography>Create your first scenario to get started</Typography>
            }
        </div>
    )
}

export default MainView