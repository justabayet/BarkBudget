import React from "react"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import CustomDatePicker from "../Fields/CustomDatePicker"
import AmountField from "../Fields/AmountField"
import { compareDate } from "../../helpers"
import { Limit } from "../../Providers/GraphValuesProvider/LimitsProvider"
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"

const LimitEntry: GenericEntry<Limit> = ({ value, handleDelete, handleSave }) => {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <CustomDatePicker
                date={value.startDate}
                setDate={(newDate) => {
                    if (!compareDate(newDate, value.startDate)) {
                        handleSave({ ...value, startDate: newDate })
                    }
                }} />

            <CustomDatePicker
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

export default LimitEntry

