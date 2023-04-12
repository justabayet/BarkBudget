import React from "react"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import CustomDatePickker from "./CustomDatePickker"
import AmountField from "./AmountField"
import { compareDate } from "../helpers"

const Limit = ({ value, handleDelete, handleSave }) => {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <CustomDatePickker
                date={value.startDate}
                setDate={(newDate) => {
                    if (!compareDate(newDate, value.startDate)) {
                        handleSave({ ...value, startDate: newDate })
                    }
                }} />

            <CustomDatePickker
                date={value.endDate}
                setDate={(newDate) => {
                    if (!compareDate(newDate, value.endDate)) {
                        handleSave({ ...value, endDate: newDate })
                    }
                }} />

            <AmountField
                amount={value.amount}
                setAmount={(newAmount) => {
                    if (newAmount !== value.amount) {
                        handleSave({ ...value, amount: newAmount })
                    }
                }} />

            <IconButton onClick={handleDelete} style={{ "marginLeft": "auto" }}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default Limit

