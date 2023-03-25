import React from 'react'
import TransactionDashboard from './TransactionDashboard'
import ExpenseGraph from './ExpenseGraph'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Button, Typography } from '@mui/material'
import { useScenario } from '../Providers/ScenarioProvider'

const ScenarioView = ({ setScenarioIndex }) => {
    const { scenarios } = useScenarios()
    const { scenario } = useScenario()

    return (
        <>
            <Typography variant="h4">Scenario: {scenario.name}</Typography>

            {scenarios.map(({ id, name }, index) => {
                return (
                    <Button
                        key={index}
                        onClick={() => {
                            setScenarioIndex(index)
                        }}>
                        Select {name}
                    </Button>
                )
            })}

            <ExpenseGraph />

            <TransactionDashboard />
        </>
    )
}

export default ScenarioView