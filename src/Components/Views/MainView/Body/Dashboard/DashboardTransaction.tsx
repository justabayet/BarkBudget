import React, { useState } from 'react'


import { AccountBalance, AddModerator, Home, Update } from '@mui/icons-material'
import { BottomNavigation, BottomNavigationAction, Box, Paper, PaperProps } from '@mui/material'

import { useDeviceDetails } from 'Providers'

import { PanelExpectations, PanelLimits, PanelRecords, PanelScenario } from './Panels'

interface NavigationBarProps extends PaperProps {
    tabIndex: number
    handleTabChange: (_: React.SyntheticEvent<Element, Event>, newValue: number) => void
}

const NavigationBar = (props: NavigationBarProps) => (
    <Paper elevation={3} {...props}>
        <BottomNavigation
            value={props.tabIndex}
            onChange={props.handleTabChange} >

            <BottomNavigationAction label='Limits' icon={<AddModerator />} />
            <BottomNavigationAction label='Home' icon={<Home />} />
            <BottomNavigationAction label='Records' icon={<AccountBalance />} />
            <BottomNavigationAction label='Expectations' icon={<Update />} />
        </BottomNavigation>
    </Paper>
)

const DashboardTransaction = () => {
    const [tabIndex, setTabIndex] = useState(1)
    const { isMobile, isBodyFullSize } = useDeviceDetails()

    const handleTabChange = (_: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setTabIndex(newValue)
    }

    return (
        <Box sx={{ width: '100%' }} id='dashboard-body'>

            {!isMobile &&
                <NavigationBar
                    sx={{ position: 'sticky', top: `calc(${isBodyFullSize ? '300px' : '(100vw / 2)'} + 21px)`, mt: 2, zIndex: 10 }}
                    tabIndex={tabIndex}
                    handleTabChange={handleTabChange} />}

            <Box sx={{ width: '100%' }} id='dashboard-list'>
                {tabIndex === 0 && <PanelLimits />}
                {tabIndex === 1 && <PanelScenario />}
                {tabIndex === 2 && <PanelRecords />}
                {tabIndex === 3 && <PanelExpectations />}
            </Box>

            <Box height={'124px'} />

            {isMobile &&
                <NavigationBar
                    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                    tabIndex={tabIndex}
                    handleTabChange={handleTabChange} />}
        </Box >
    )
}

export default DashboardTransaction