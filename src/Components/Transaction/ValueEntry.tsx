import React from "react"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AmountField from "../Fields/AmountField"
import CustomDatePicker from "../Fields/CustomDatePicker"
import { compareDate } from "../../helpers"
import { Value } from "../../Providers/GraphValuesProvider/ValuesProvider"
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"


const ValueEntry: GenericEntry<Value> = ({ value, handleDelete, handleSave }) => {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>

            <CustomDatePicker
                date={value.date}
                setDate={(newDate) => {
                    if (!compareDate(newDate, value.date)) {
                        handleSave({ ...value, date: newDate })
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

export default ValueEntry

