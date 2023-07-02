import React from 'react'

import { Add, Delete } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'

import { Scenario } from 'Providers'
import { compareDate } from 'helpers'

import { CustomDatePicker, CustomTextField } from '../Fields'

import DialogDeleteScenario from './DialogDeleteScenario'


interface HeaderScenarioProps {
    scenario: Scenario
    scenarios: Scenario[]
    addScenario: () => void
    deleteScenario: (scenario: Scenario, index: number) => void
    updateScenario: (scenario: Scenario, index: number) => void
}

const HeaderScenario = ({ scenario, scenarios, addScenario, deleteScenario, updateScenario }: HeaderScenarioProps) => {
    const index = scenarios.findIndex(scenarioObj => scenarioObj.id === scenario?.id)
    if (index === -1) console.log('Current scenario not found in scenarios')

    const NameField = () => (
        <CustomTextField
            label={'Name'}
            text={scenario.name}
            setText={(newName) => {
                if (newName !== scenario.name) {
                    updateScenario({ ...scenario, name: newName }, index)
                }
            }} />
    )

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => deleteScenario(scenario, index)

    const Actions = () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color='primary' onClick={() => { addScenario() }} style={{ 'marginLeft': 'auto' }}>
                <Add />
            </IconButton>

            <IconButton onClick={handleOpenDeleteDialog} style={{ 'marginLeft': 'auto' }}>
                <Delete />
            </IconButton>

            <DialogDeleteScenario
                handleCloseDeleteDialog={handleCloseDeleteDialog}
                scenarioName={scenario.name}
                openDeleteDialog={openDeleteDialog}
                setOpenDeleteDialog={setOpenDeleteDialog} />
        </Box>
    )

    const StartDateField = () => (
        <CustomDatePicker
            label='Starting Date'
            date={scenario.startDate}
            setDate={(newDate) => {
                if (!compareDate(newDate, scenario.startDate)) {
                    updateScenario({ ...scenario, startDate: newDate }, index)
                }
            }} />
    )

    const EndDateField = () => (
        <CustomDatePicker
            label='Ending Date'
            date={scenario.endDate}
            setDate={(newDate) => {
                if (!compareDate(newDate, scenario.endDate)) {
                    updateScenario({ ...scenario, endDate: newDate }, index)
                }
            }} />
    )

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <NameField />
                <Actions />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StartDateField />
                <EndDateField />
            </Box>
        </Stack>
    )
}

export default HeaderScenario
