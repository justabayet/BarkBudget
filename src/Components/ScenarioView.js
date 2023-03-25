import React from 'react'
import TransactionDashboard from './TransactionDashboard'
import ExpenseGraph from './ExpenseGraph'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Button, Typography } from '@mui/material'

const ScenarioView = ({ scenarioIndex, setScenarioIndex }) => {

    const { scenarios } = useScenarios()

    return (
        <>
            <Typography variant="h4">Scenario: {scenarios[scenarioIndex].name}</Typography>

            {scenarios.map(({ id, name }, index) => {
                return ( <Button onClick={ () => { setScenarioIndex(index) } }>{ name }</Button> )
            })}

            <ExpenseGraph />

            <TransactionDashboard />
        </>
    )
}

export default ScenarioView