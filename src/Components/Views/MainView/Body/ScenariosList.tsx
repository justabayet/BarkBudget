import React from 'react'

import { Stack } from '@mui/material'

import { Scenario, ScenarioProvider, useScenarios } from 'Providers'

import { DataPinnedScenario, DataScenario } from './Data'
import Graph from './Graph'

import DashboardTransaction from './Dashboard'

interface ScenariosListProps {
    scenarios: Scenario[]
}

const ScenariosList = ({ scenarios }: ScenariosListProps): JSX.Element => {
    const { currentScenario } = useScenarios()

    const getBody = (scenario: Scenario): JSX.Element | null => {
        if (currentScenario && scenario.id === currentScenario.id) {
            return (
                <>
                    <DataScenario />
                    <DashboardTransaction />
                </>
            )

        } else if (scenario.isPinned) {
            return <DataPinnedScenario />

        } else {
            return null
        }
    }

    return (
        <Stack>
            <Graph />

            {scenarios.map(scenario => {
                return (
                    <ScenarioProvider scenario={scenario} key={scenario.id}>
                        {getBody(scenario)}
                    </ScenarioProvider>
                )
            })}
        </Stack>
    )
}

export default ScenariosList