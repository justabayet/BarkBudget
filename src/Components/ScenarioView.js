import React from 'react'
import TransactionDashboard from './TransactionDashboard'
import ExpenseGraph from './ExpenseGraph'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Button } from '@mui/material'
import ScenarioHeader from './ScenarioHeader'

const ScenarioView = () => {
    const { scenarios, setScenarioIndex } = useScenarios()

    return (
        <>
            <ScenarioHeader />

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