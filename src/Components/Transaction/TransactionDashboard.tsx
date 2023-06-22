import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AddModeratorIcon from '@mui/icons-material/AddModerator'
import HomeIcon from '@mui/icons-material/Home'
import UpdateIcon from '@mui/icons-material/Update'
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import React, { useState } from 'react'
import { useDeviceDetails } from '../../Providers/DeviceDetailsProvider'
import { Expectation, useExpectations } from '../../Providers/GraphValuesProvider/ExpectationsProvider'
import { Limit, useLimits } from '../../Providers/GraphValuesProvider/LimitsProvider'
import { Record, useRecords } from '../../Providers/GraphValuesProvider/RecordsProvider'
import ScenarioPanel from '../Scenario/ScenarioPanel'
import ExpectationEntry from './ExpectationEntry'
import LimitEntry from './LimitEntry'
import RecordEntry from './RecordEntry'
import TransactionList from './TransactionList'

const TransactionDashboard = () => {
    const [tabIndex, setTabIndex] = useState(1)
    const { isMobile, isBodyFullSize } = useDeviceDetails()

    const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setTabIndex(newValue)
    }

    const navigation = (
        <BottomNavigation
            value={tabIndex}
            onChange={handleTabChange}
        >
            <BottomNavigationAction label="Limits" icon={<AddModeratorIcon />} />
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Records" icon={<AccountBalanceIcon />} />
            <BottomNavigationAction label="Expectations" icon={<UpdateIcon />} />
        </BottomNavigation>
    )

    return (
        <Box sx={{ width: '100%' }} id="dashboard-body">

            {!isMobile &&
                <Paper elevation={3} sx={{ position: 'sticky', top: `calc(${isBodyFullSize ? "300px" : "(100vw / 2)"} + 21px)`, mt: 2, zIndex: 10 }}>
                    {navigation}
                </Paper>
            }

            <Box sx={{ width: '100%' }} id="dashboard-list">
                {tabIndex === 0 && <TransactionList<Limit> useValues={useLimits} ChildComponent={LimitEntry} />}
                {tabIndex === 1 && <ScenarioPanel />}
                {tabIndex === 2 && <TransactionList<Record> useValues={useRecords} ChildComponent={RecordEntry} />}
                {tabIndex === 3 && <TransactionList<Expectation> useValues={useExpectations} ChildComponent={ExpectationEntry} />}
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