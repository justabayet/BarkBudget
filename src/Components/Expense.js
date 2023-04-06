import React from "react"
import { Box, FormControl, IconButton, MenuItem, Select } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import CustomDatePickker from "./CustomDatePickker"
import AmountField from "./AmountField"
import { compareDate } from "../helpers"
import { modeNames } from "../Modes/const"
import { textFieldStyle } from "../style"
import ModeSelector from "./ModeSelector"

const Expense = ({ value, handleDelete, handleSave }) => {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <CustomDatePickker
                date={value.startDate}
                setDate={(newDate) => {
                    if (!compareDate(newDate, value.startDate)) {
                        handleSave({ ...value, startDate: newDate })
                    }
                }} />

            {[modeNames.DAILY].includes(value.mode) &&
                <CustomDatePickker
                    date={value.endDate}
                    setDate={(newDate) => {
                        if (!compareDate(newDate, value.endDate)) {
                            handleSave({ ...value, endDate: newDate })
                        }
                    }} />
            }


            <AmountField
                amount={value.amount}
                setAmount={(newAmount) => {
                    if (newAmount !== value.amount) {
                        handleSave({ ...value, amount: newAmount })
                    }
                }} />

            <ModeSelector
                mode={value.mode}
                setMode={(newMode) => {
                    if (newMode !== value.mode) {
                        handleSave({ ...value, mode: newMode })
                    }
                }} />

            <IconButton onClick={handleDelete} style={{ "marginLeft": "auto" }}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default Expense

