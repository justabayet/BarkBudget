import React, { useEffect, useState } from "react"
import { Box, IconButton, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { getFormattedDate } from "../helpers"
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { textFieldStyle } from "./Transaction"
import { useScenarios } from "../Providers/ScenariosProvider"

const ScenarioHeader = () => {
    const { scenarios, addScenario, deleteScenario, updateScenario, currentScenario } = useScenarios()

    const scenario = currentScenario

    const [startDate, setStartDate] = useState(getFormattedDate(scenario.startDate))
    const [endDate, setEndDate] = useState(getFormattedDate(scenario.endDate))
    const [startAmount, setStartAmount] = useState(scenario.startAmount)

    const index = scenarios.findIndex(scenarioObj => scenarioObj.id === scenario.id)

    if (index === -1) {
        console.log("Current scenario not found in scenarios")
    }

    useEffect(() => {
        setStartDate(getFormattedDate(scenario.startDate))
        setEndDate(getFormattedDate(scenario.endDate))
        setStartAmount(scenario.startAmount)
    }, [scenario])

    const save = () => {
        const newStartDate = new Date(startDate)
        if (isNaN(newStartDate)) {
            console.log("Invalid date", startDate)
            return
        }

        const newEndDate = new Date(endDate)
        if (isNaN(newEndDate)) {
            console.log("Invalid date", endDate)
            return
        }

        const { ...updatedValue } = scenario
        updatedValue.startDate = newStartDate
        updatedValue.endDate = newEndDate
        updatedValue.startAmount = startAmount
        updateScenario(updatedValue, index)
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Typography variant="h4">Scenario: {scenario.name}</Typography>

                <IconButton color="primary" onClick={() => { addScenario() }} style={{ "marginLeft": "auto" }}>
                    <AddIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <DatePicker
                    sx={textFieldStyle}
                    onAccept={(newStartDateValue) => {
                        setStartDate(newStartDateValue.format('YYYY-MM-DD'))

                        const newStartDate = new Date(newStartDateValue)
                        if (isNaN(newStartDate)) {
                            console.log("Invalid date", newStartDateValue)
                            return
                        }
                        const { ...updatedValue } = scenario
                        updatedValue.startDate = newStartDate
                        updatedValue.endDate = new Date(endDate)
                        updatedValue.startAmount = startAmount
                        updateScenario(updatedValue, index)
                    }}
                    value={dayjs(startDate)}
                    slotProps={{
                        textField: {
                            size: "small",
                            onChange: (newStartDateValue) => {
                                setStartDate(newStartDateValue.format('YYYY-MM-DD'))
                            },
                            onBlur: save
                        }
                    }}
                    format="DD-MM-YYYY" />

                <DatePicker
                    sx={textFieldStyle}
                    onAccept={(newEndDateValue) => {
                        setEndDate(newEndDateValue.format('YYYY-MM-DD'))

                        const newEndDate = new Date(newEndDateValue)
                        if (isNaN(newEndDate)) {
                            console.log("Invalid date", newEndDateValue)
                            return
                        }
                        const { ...updatedValue } = scenario
                        updatedValue.startDate = new Date(startDate)
                        updatedValue.endDate = newEndDate
                        updatedValue.startAmount = startAmount
                        updateScenario(updatedValue, index)
                    }}
                    value={dayjs(endDate)}
                    slotProps={{
                        textField: {
                            size: "small",
                            onChange: (newEndDateValue) => {
                                setEndDate(newEndDateValue.format('YYYY-MM-DD'))
                            },
                            onBlur: save
                        }
                    }}
                    format="DD-MM-YYYY" />
                <TextField
                    variant="outlined"
                    sx={textFieldStyle}
                    size="small"
                    value={startAmount}
                    onChange={(event) => {
                        const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/;
                        if (event.target.value === "" || regex.test(event.target.value)) {
                            setStartAmount(event.target.value)
                        }
                    }}
                    onBlur={save}
                />
                <IconButton onClick={() => deleteScenario(scenario, index)} style={{ "marginLeft": "auto" }}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </>
    )
}

export default ScenarioHeader

