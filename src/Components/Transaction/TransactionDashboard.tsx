import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import React, { useState } from 'react'
import { useDeviceDetails } from '../../Providers/DeviceDetailsProvider'
import { Expense, useExpenses } from '../../Providers/GraphValuesProvider/ExpensesProvider'
import { Limit, useLimits } from '../../Providers/GraphValuesProvider/LimitsProvider'
import { Value, useValues } from '../../Providers/GraphValuesProvider/ValuesProvider'
import ScenarioPanel from '../Scenario/ScenarioPanel'
import ExpenseEntry from './ExpenseEntry'
import LimitEntry from './LimitEntry'
import TransactionList from './TransactionList'
import ValueEntry from './ValueEntry'

const TransactionDashboard = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const { isMobile } = useDeviceDetails()

    const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setTabIndex(newValue)
    }

    const navigation = (
        <BottomNavigation
            showLabels
            value={tabIndex}
            onChange={handleTabChange}
        >
            <BottomNavigationAction label="Scenario" icon={<></>} />
            <BottomNavigationAction label="Expenses" icon={<></>} />
            <BottomNavigationAction label="Values" icon={<></>} />
            <BottomNavigationAction label="Limits" icon={<></>} />
        </BottomNavigation>
    )

    return (
        <Box sx={{ width: '100%' }}>

            {!isMobile &&
                <Paper elevation={3} sx={{ mt: 3 }}>
                    {navigation}
                </Paper>}

            <Box sx={{ p: 1, width: '100%' }}>
                {tabIndex === 0 && <ScenarioPanel />}
                {tabIndex === 1 && <TransactionList<Expense> useValues={useExpenses} ChildComponent={ExpenseEntry} />}
                {tabIndex === 2 && <TransactionList<Value> useValues={useValues} ChildComponent={ValueEntry} />}
                {tabIndex === 3 && <TransactionList<Limit> useValues={useLimits} ChildComponent={LimitEntry} />}
            </Box>

            {isMobile &&
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    {navigation}
                </Paper>
            }

        </Box>
    )
}

export default TransactionDashboard