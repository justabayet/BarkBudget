import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import { useScenarios } from '../Providers/ScenariosProvider'
import MainHeader from './MainHeader'
import ScenarioView from './ScenarioView'
import { ScenarioProvider } from '../Providers/ScenarioProvider'

const MainView = () => {
    const { user } = useAuthentication()
    const { scenarios } = useScenarios()

    const [scenarioIndex, setScenarioIndex] = useState(null)

    useEffect(() => {
        if(scenarios.length === 0) {
            setScenarioIndex(null)
    
        } else if(scenarioIndex === null) {
            setScenarioIndex(0)
        }
    }, [scenarios.length, scenarioIndex])
    

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <MainHeader />

            {user && scenarioIndex !== null
                ? 
                <ScenarioProvider scenario={scenarios[scenarioIndex]}>
                    <ScenarioView setScenarioIndex={setScenarioIndex}/>
                </ScenarioProvider>

                : <Typography>Create your first scenario to get started</Typography>
            }
        </div>
    )
}

export default MainView