import React from 'react'
import { useScenarios } from '../Providers/ScenariosProvider'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { textFieldStyle } from '../style'

const ScenarioSelector = () => {
    const { scenarios, setScenarioId, currentScenario } = useScenarios()

    return (
        <FormControl sx={{ m: 1, minWidth: 120, ...textFieldStyle }} size="small">
            <InputLabel>Selected Scenario</InputLabel>
            <Select
                value={currentScenario.id}
                label={"Selected Scenario"}
                onChange={(event, child) => {
                    const scenarioId = child.props.value
                    if (!currentScenario || currentScenario.id !== scenarioId) {
                        setScenarioId(scenarioId)
                    }
                }}
            >
                {Object.values(scenarios).map(scenario => {
                    const isSelected = scenario.id === currentScenario.id
                    return (
                        <MenuItem
                            value={scenario.id}
                            key={scenario.id}
                            sx={isSelected ? { display: 'none' } : {}}
                        >
                            {scenario.name} {scenario.id}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default ScenarioSelector


