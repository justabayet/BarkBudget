import React from 'react'
import { Scenario } from '../../Providers/ScenariosProvider'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { textFieldStyle } from '../../style'

interface ScenarioSelectorProps {
    currentScenario: Scenario
    scenarios: Scenario[]
    setScenarioId: (newScenarioId: string | null) => void
}

const ScenarioSelector = ({ scenarios, setScenarioId, currentScenario }: ScenarioSelectorProps): JSX.Element => {
    return (
        <FormControl sx={{ m: 1, minWidth: 120, ...textFieldStyle }} size="small">
            <InputLabel>Selected Scenario</InputLabel>
            <Select
                value={currentScenario.id}
                label={"Selected Scenario"}
                onChange={(event, child) => {
                    if (React.isValidElement(child)) {
                        const scenarioId = child.props.value
                        if (!currentScenario || currentScenario.id !== scenarioId) {
                            setScenarioId(scenarioId)
                        }
                    }
                }}
                onClose={() => {
                    setTimeout(() => {
                        if (!document.activeElement) return
                        (document.activeElement as HTMLElement).blur()
                    }, 0)
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
                {Object.values(scenarios).length === 1 &&
                    (
                        <MenuItem disabled>
                            No other scenario available
                        </MenuItem>
                    )}
            </Select>
        </FormControl>
    )
}

export default ScenarioSelector


