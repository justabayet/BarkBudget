import React from 'react'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Autocomplete, TextField } from '@mui/material'

const PinnedScenariosSelector = () => {
    const { scenarios } = useScenarios()
    const pinnedScenarios = []

    scenarios?.forEach(scenario => {
        if (scenario.isPinned) pinnedScenarios.push(scenario)
    })

    return (

        <Autocomplete
            multiple
            options={scenarios}
            disableCloseOnSelect
            value={pinnedScenarios}
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
    )
}

export default PinnedScenariosSelector


