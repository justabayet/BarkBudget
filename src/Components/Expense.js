import React, { useEffect, useRef, useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { getFormattedDate } from "../helpers"
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers"
import TransactionDatePickker from "./TransactionParts/TransactionDatePickker";

export const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
        "& > fieldset": {
            borderColor: 'rgba(0, 0, 0, 0)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.30)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.67)',
            borderWidth: 1
        },
    },
}

const Expense = ({ value, handleDelete, handleSave }) => {
    const [amount, setAmount] = useState(value.amount)

    useEffect(() => {
        setAmount(value.amount)
    }, [value])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <TransactionDatePickker
                initialDate={getFormattedDate(value.startDate)}
                saveDate={(newDate) => {
                    handleSave({ ...value, startDate: newDate })
                }} />

            <TransactionDatePickker
                initialDate={getFormattedDate(value.endDate)}
                saveDate={(newDate) => {
                    handleSave({ ...value, endDate: newDate })
                }} />


            <TextField
                variant="outlined"
                sx={textFieldStyle}
                size="small"
                value={amount}
                onChange={(event) => {
                    const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/;
                    if (event.target.value === "" || regex.test(event.target.value)) {
                        setAmount(parseInt(event.target.value))
                    }
                }}
                onBlur={() => { handleSave({ ...value, amount }) }}
            />
            <IconButton onClick={handleDelete} style={{ "marginLeft": "auto" }}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default Expense

