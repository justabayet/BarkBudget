import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { Scenario } from '../../Providers/ScenariosProvider'
import { textFieldStyle } from '../../style'

interface PinnedScenariosSelectorProps {
    scenarios: Scenario[]
    updateScenario: (scenario: Scenario, index: number) => void
}

const PinnedScenariosSelector = ({ scenarios, updateScenario }: PinnedScenariosSelectorProps): JSX.Element => {
    const pinnedScenarios: Scenario[] = []

    scenarios?.forEach(scenario => {
        if (scenario.isPinned) pinnedScenarios.push(scenario)
    })

    const handleAdd = (scenarioId: string) => {
        const index = scenarios.findIndex(refScenario => refScenario.id === scenarioId)
        const scenario = scenarios[index]

        scenario.isPinned = true

        updateScenario(scenario, index)
    }

    const handleDelete = (scenario: Scenario) => {
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
                        if (!document.activeElement) return
                        (document.activeElement as HTMLElement).blur()
                    }, 0)
                }}
                onChange={(event, child) => {
                    if (React.isValidElement(child)) {
                        const scenarioId = child.props.value
                        handleAdd(scenarioId)
                    }
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


