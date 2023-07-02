import React from 'react'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { Scenario } from 'Providers'
import { textFieldStyle } from 'style'


interface SelectorScenarioProps {
    currentScenario: Scenario
    scenarios: Scenario[]
    setScenarioId: (newScenarioId: string | null) => void
}

const SelectorScenario = ({ scenarios, setScenarioId, currentScenario }: SelectorScenarioProps): JSX.Element => {
    return (
        <FormControl sx={{ m: 1, minWidth: 120, ...textFieldStyle }} size='small'>
            <InputLabel>Selected Scenario</InputLabel>

            <Select
                value={currentScenario.id}
                label={'Selected Scenario'}
                inputProps={{ MenuProps: { disableScrollLock: true } }}
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
                }}>

                {Object.values(scenarios).map(scenario => {
                    const isSelected = scenario.id === currentScenario.id
                    return (
                        <MenuItem
                            value={scenario.id}
                            key={scenario.id}
                            sx={isSelected ? { display: 'none' } : {}} >

                            {scenario.name}
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


export default SelectorScenario
