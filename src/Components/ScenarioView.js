import React from 'react'
import TransactionDashboard from './TransactionDashboard'
import ExpenseGraph from './ExpenseGraph'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Autocomplete, Button, TextField, Typography, Box, Stack } from '@mui/material'
import ScenarioHeader from './ScenarioHeader'
import { useGraph } from '../Providers/GraphProvider'

const scenarioPickerStyle = {
    "& .MuiOutlinedInput-root": {
        "& > fieldset": {
            borderColor: 'rgba(0, 0, 0, 0)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(0, 0, 0, 0)',
        },
    },
}

const ScenarioView = () => {
    const { scenarios, setScenarioIndex, scenarioIndex, currentScenario } = useScenarios()
    const { pinnedScenarios } = useGraph()

    return (
        <>

            <Stack spacing={3} >
                <ScenarioHeader />

                <Autocomplete
                    disableClearable
                    options={scenarios.map((scenario, index) => {
                        return { index, ...scenario }
                    })}
                    value={currentScenario}
                    getOptionLabel={option => option.name}
                    renderInput={(params) => <TextField {...params} sx={scenarioPickerStyle} />}
                    onChange={(event, value) => {
                        setScenarioIndex(value.index)
                    }}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id
                    }}
                />

                <ExpenseGraph />

                <Autocomplete
                    multiple
                    options={scenarios}
                    disableCloseOnSelect
                    value={pinnedScenarios.map(pinnedScenario => pinnedScenario.scenario)}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Pinned Scenarios"
                        />
                    )}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id
                    }}
                    onChange={(event, value, reason) => {
                        console.log(event, value, reason)
                        switch (reason) {
                            case 'removeOption':
                                console.log("removeOption")
                                break;

                            case 'clear':
                                console.log("clear")
                                break

                            default:
                                break
                        }
                        // setScenarioIndex(value.index)
                    }}
                />
            </Stack>

            <TransactionDashboard />
        </>
    )
}

export default ScenarioView