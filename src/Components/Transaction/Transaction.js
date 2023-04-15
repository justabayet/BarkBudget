import React from "react"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import AmountField from "../Fields/AmountField";
import CustomDatePickker from "../Fields/CustomDatePickker";
import { compareDate } from "../../helpers";



const Transaction = ({ value, handleDelete, handleSave }) => {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>

            <CustomDatePickker
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

export default Transaction

