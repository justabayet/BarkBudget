import React from 'react'
import { useScenarios } from '../../Providers/ScenariosProvider'
import { MenuItem, FormControl, Chip, Select, InputLabel, Box } from '@mui/material'
import { textFieldStyle } from '../../style'

const PinnedScenariosSelector = () => {
    const { scenarios, updateScenario } = useScenarios()
    const pinnedScenarios = []

    scenarios?.forEach(scenario => {
        if (scenario.isPinned) pinnedScenarios.push(scenario)
    })

    const handleAdd = (scenarioId) => {
        const index = scenarios.findIndex(refScenario => refScenario.id === scenarioId)
        const scenario = scenarios[index]

        scenario.isPinned = true

        updateScenario(scenario, index)
    }

    const handleDelete = (scenario) => {
        const index = scenarios.findIndex(refScenario => refScenario.id === scenario.id)

        scenario.isPinned = false

        updateScenario(scenario, index)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120, ...textFieldStyle }} >
            <InputLabel>Pinned Scenario</InputLabel>
            <Select
                multiple
                value={pinnedScenarios}
                label={"Selected Scenario"}
                onClose={() => {
                    setTimeout(() => {
                        document.activeElement.blur()
                    }, 0)
                }}
                onChange={(event, child) => {
                    const scenarioId = child.props.value
                    handleAdd(scenarioId)
                }}
                renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(scenario => (
                            <Chip
                                key={scenario.id}
                                label={scenario.name}
                                onMouseDown={(event) => {
                                    event.stopPropagation()
                                    event.preventDefault()
                                }}
                                onDelete={(event) => {
                                    handleDelete(scenario)
                                    event.stopPropagation()
                                }} />
                        ))}
                    </Box>
                )}
            >
                {Object.values(scenarios).map(scenario => {
                    return (
                        <MenuItem
                            value={scenario.id}
                            key={scenario.id}
                            sx={scenario.isPinned ? { display: 'none' } : {}}
                        >
                            {scenario.name} {scenario.id}
                        </MenuItem>
                    )
                })}
                {Object.values(scenarios).length === pinnedScenarios.length &&
                    (
                        <MenuItem disabled>
                            No other scenario available
                        </MenuItem>
                    )}
            </Select>
        </FormControl >
    )
}

export default PinnedScenariosSelector


