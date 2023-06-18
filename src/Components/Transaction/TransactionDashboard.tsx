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
    const [tabIndex, setTabIndex] = useState(1)
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
            <BottomNavigationAction label="" icon={<>Limits</>} />
            <BottomNavigationAction label="" icon={<>Scenario</>} />
            <BottomNavigationAction label="" icon={<>Records</>} />
            <BottomNavigationAction label="" icon={<>Expectations</>} />
        </BottomNavigation>
    )

    return (
        <Box sx={{ width: '100%' }} id="dashboard-body">

            {!isMobile &&
                <Paper elevation={3} sx={{ mt: 2 }}>
                    {navigation}
                </Paper>
            }

            <Box sx={{ width: '100%' }} id="dashboard-list">
                {tabIndex === 0 && <TransactionList<Limit> useValues={useLimits} ChildComponent={LimitEntry} />}
                {tabIndex === 1 && <ScenarioPanel />}
                {tabIndex === 2 && <TransactionList<Value> useValues={useValues} ChildComponent={ValueEntry} />}
                {tabIndex === 3 && <TransactionList<Expense> useValues={useExpenses} ChildComponent={ExpenseEntry} />}
            </Box>

            <Box height={"124px"}></Box>

            {isMobile &&
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    {navigation}
                </Paper>
            }

        </Box>
    )
}

export default TransactionDashboard