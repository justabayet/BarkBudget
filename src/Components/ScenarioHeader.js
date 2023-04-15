import React, { useEffect, useState } from "react"
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useScenarios } from "../Providers/ScenariosProvider"
import CustomDatePickker from "./CustomDatePickker"
import { compareDate } from "../helpers"
import { textFieldStyle } from "../style"

const ScenarioHeader = () => {
    const { scenarios, addScenario, deleteScenario, updateScenario, currentScenario } = useScenarios()

    const scenario = currentScenario

    const index = scenarios.findIndex(scenarioObj => scenarioObj.id === scenario.id)

    if (index === -1) {
        console.log("Current scenario not found in scenarios")
    }

    const [internalName, setInternalName] = useState(scenario.name)

    useEffect(() => {
        setInternalName(scenario.name)
    }, [scenario.name])

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Typography variant="h4">Scenario: {scenario.name}</Typography>

                <IconButton color="primary" onClick={() => { addScenario() }} style={{ "marginLeft": "auto" }}>
                    <AddIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>

                        <CustomDatePickker
                            label="Starting Date"
                            date={scenario.startDate}
                            setDate={(newDate) => {
                                if (!compareDate(newDate, scenario.startDate)) {
                                    updateScenario({ ...scenario, startDate: newDate }, index)
                                }
                            }} />

                        <CustomDatePickker
                            label="Ending Date"
                            date={scenario.endDate}
                            setDate={(newDate) => {
                                if (!compareDate(newDate, scenario.endDate)) {
                                    updateScenario({ ...scenario, endDate: newDate }, index)
                                }
                            }} />

                        <IconButton onClick={() => deleteScenario(scenario, index)} style={{ "marginLeft": "auto" }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>

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
                    </Box>
                </Stack >
            </Box >
        </>
    )
}

export default ScenarioHeader

