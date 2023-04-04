import React from 'react'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Autocomplete, TextField } from '@mui/material'


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

const ScenarioSelector = () => {
    const { scenarios, setScenarioId, currentScenario } = useScenarios()

    return (
        <Autocomplete
            disableClearable
            options={scenarios.map((scenario, index) => {
                return { index, ...scenario }
            })}
            value={currentScenario}
            getOptionLabel={option => option.name}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.id}>
                        {option.name} {option.id}
                    </li>
                )
            }}
            renderInput={(params) => <TextField {...params} sx={scenarioPickerStyle} />}
            onChange={(event, value) => {
                if (!currentScenario || currentScenario.id !== value.id) {
                    setScenarioId(value.id)
                }
            }}
            isOptionEqualToValue={(option, value) => {
                return option.id === value.id
            }}
        />
    )
}

export default ScenarioSelector


