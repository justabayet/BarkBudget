import React from 'react'

import { Add, Delete } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'

import { Scenario } from 'Providers'
import { compareDate } from 'helpers'

import { CustomDatePicker, CustomTextField } from '../Fields'

import DialogDeleteScenario from './DialogDeleteScenario'

interface NameFieldProps {
    name: string
    scenario: Scenario
    updateScenario: (scenario: Scenario, index: number) => void
    index: number
}

const NameField = ({ name, scenario, updateScenario, index }: NameFieldProps) => (
    <CustomTextField
        label={'Name'}
        value={name}
        setValue={(newName) => {
            if (newName !== name) {
                updateScenario({ ...scenario, name: newName }, index)
            }
        }} />
)

interface ActionsProps {
    name: string
    scenario: Scenario
    addScenario: () => void
    deleteScenario: (scenario: Scenario, index: number) => void
    index: number
}

const Actions = ({ name, addScenario, deleteScenario, scenario, index }: ActionsProps) => {

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => deleteScenario(scenario, index)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color='primary' onClick={() => { addScenario() }} style={{ 'marginLeft': 'auto' }}>
                <Add />
            </IconButton>

            <IconButton onClick={handleOpenDeleteDialog} style={{ 'marginLeft': 'auto' }}>
                <Delete />
            </IconButton>

            <DialogDeleteScenario
                handleCloseDeleteDialog={handleCloseDeleteDialog}
                scenarioName={name}
                openDeleteDialog={openDeleteDialog}
                setOpenDeleteDialog={setOpenDeleteDialog} />
        </Box>
    )
}
interface StartDateFieldProps {
    startDate: Date
    scenario: Scenario
    updateScenario: (scenario: Scenario, index: number) => void
    index: number
}

const StartDateField = ({ startDate, scenario, index, updateScenario }: StartDateFieldProps) => (
    <CustomDatePicker
        label='Starting Date'
        value={startDate}
        setValue={(newDate) => {
            if (!compareDate(newDate, startDate)) {
                updateScenario({ ...scenario, startDate: newDate }, index)
            }
        }} />
)
interface EndDateFieldProps {
    endDate: Date
    scenario: Scenario
    updateScenario: (scenario: Scenario, index: number) => void
    index: number
}

const EndDateField = ({ endDate, scenario, index, updateScenario }: EndDateFieldProps) => (
    <CustomDatePicker
        label='Ending Date'
        value={endDate}
        setValue={(newDate) => {
            if (!compareDate(newDate, endDate)) {
                updateScenario({ ...scenario, endDate: newDate }, index)
            }
        }} />
)

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

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <NameField name={scenario.name} index={index} scenario={scenario} updateScenario={updateScenario} />
                <Actions name={scenario.name} index={index} scenario={scenario} deleteScenario={deleteScenario} addScenario={addScenario} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StartDateField startDate={scenario.startDate} index={index} scenario={scenario} updateScenario={updateScenario} />
                <EndDateField endDate={scenario.endDate} index={index} scenario={scenario} updateScenario={updateScenario} />
            </Box>
        </Stack>
    )
}

export default HeaderScenario
