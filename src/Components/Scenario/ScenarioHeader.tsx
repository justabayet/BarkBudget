import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, Stack, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Scenario } from "../../Providers/ScenariosProvider"
import { compareDate } from "../../helpers"
import { textFieldStyle } from "../../style"
import CustomDatePicker from "../Fields/CustomDatePicker"

interface ScenarioHeaderProps {
    scenario: Scenario
    scenarios: Scenario[]
    addScenario: () => void
    deleteScenario: (scenario: Scenario, index: number) => void
    updateScenario: (scenario: Scenario, index: number) => void
}

const ScenarioHeader = ({ scenario, scenarios, addScenario, deleteScenario, updateScenario }: ScenarioHeaderProps) => {
    const index = scenarios.findIndex(scenarioObj => scenarioObj.id === scenario?.id)

    if (index === -1) {
        console.log("Current scenario not found in scenarios")
    }

    const [internalName, setInternalName] = useState(scenario.name)

    useEffect(() => {
        setInternalName(scenario.name)
    }, [scenario.name])

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <TextField
                    variant="outlined"
                    sx={textFieldStyle}
                    label="Name"
                    size="small"
                    value={internalName}
                    onChange={(event) => {
                        setInternalName(event.target.value)
                    }}
                    onBlur={() => {
                        if (internalName !== scenario.name) {
                            updateScenario({ ...scenario, name: internalName }, index)
                        }
                    }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="primary" onClick={() => { addScenario() }} style={{ "marginLeft": "auto" }}>
                        <AddIcon />
                    </IconButton>

                    <IconButton onClick={() => deleteScenario(scenario, index)} style={{ "marginLeft": "auto" }}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                <CustomDatePicker
                    label="Starting Date"
                    date={scenario.startDate}
                    setDate={(newDate) => {
                        if (!compareDate(newDate, scenario.startDate)) {
                            console.log("## Update Scenario")
                            updateScenario({ ...scenario, startDate: newDate }, index)
                        }
                    }} />

                <CustomDatePicker
                    label="Ending Date"
                    date={scenario.endDate}
                    setDate={(newDate) => {
                        if (!compareDate(newDate, scenario.endDate)) {
                            updateScenario({ ...scenario, endDate: newDate }, index)
                        }
                    }} />
            </Box>
        </Stack>
    )
}

export default ScenarioHeader

