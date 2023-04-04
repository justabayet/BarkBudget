import React from 'react'
import { useScenarios } from '../Providers/ScenariosProvider'
import { Autocomplete, TextField } from '@mui/material'

const PinnedScenariosSelector = () => {
    const { scenarios, updateScenario } = useScenarios()
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
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.id}>
                        {option.name} {option.id}
                    </li>
                )
            }}
            isOptionEqualToValue={(option, value) => {
                return option.id === value.id
            }}
            onChange={(event, value, reason, details) => {

                if (["selectOption", "removeOption"].includes(reason)) {
                    const scenario = details.option
                    const index = scenarios.find(refScenario => refScenario.id === scenario.id)

                    if (reason === "selectOption") {
                        scenario.isPinned = true

                    } else if (reason === "removeOption") {
                        scenario.isPinned = false
                    }

                    updateScenario(scenario, index)

                } else if (reason === "clear") {

                    pinnedScenarios.forEach(pinnedScenario => {
                        const index = scenarios.find(refScenario => refScenario.id === pinnedScenario.id)
                        pinnedScenario.isPinned = false
                        updateScenario(pinnedScenario, index)
                    })
                }
            }}
        />
    )
}

export default PinnedScenariosSelector


