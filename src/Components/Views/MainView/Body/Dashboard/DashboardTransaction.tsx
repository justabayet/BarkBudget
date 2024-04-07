import React, { useState } from 'react';


import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import Settings from '@mui/icons-material/Settings';
import Update from '@mui/icons-material/Update';
import { BottomNavigation, BottomNavigationAction, Box, Paper, PaperProps, SxProps, Theme } from '@mui/material';

import { useDeviceDetails } from 'Providers';

import { PanelExpectations, PanelRecords, PanelScenario } from './Panels';

interface NavigationBarProps extends PaperProps {
    sx: SxProps<Theme>
    tabIndex: number
    handleTabChange: (_: React.SyntheticEvent<Element, Event>, newValue: number) => void
}

const NavigationBar = ({ sx, tabIndex, handleTabChange }: NavigationBarProps) => {

    return (
        <Paper elevation={3} sx={sx}>
            <BottomNavigation
                value={tabIndex}
                onChange={handleTabChange} >

                <BottomNavigationAction label='Settings' icon={<Settings />} />
                <BottomNavigationAction label='Records' icon={<FileDownloadDoneIcon />} />
                <BottomNavigationAction label='Expectations' icon={<Update />} />
            </BottomNavigation>
        </Paper>
    )
}

const DashboardTransaction = () => {
    const [tabIndex, setTabIndex] = useState(0)
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
                {tabIndex === 0 && <PanelScenario />}
                {tabIndex === 1 && <PanelRecords />}
                {tabIndex === 2 && <PanelExpectations />}
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