import React, { useEffect, useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { getFormattedDate } from "../helpers"
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers"

const textFieldStyle = {
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

const Transaction = ({ expense, handleDelete, handleSave }) => {
    const [date, setDate] = useState(getFormattedDate(new Date(expense.date)))
    const [amount, setAmount] = useState(expense.amount)

    useEffect(() => {
        const formattedDate = getFormattedDate(new Date(expense.date))
        setDate(formattedDate)
        setAmount(expense.amount)
    }, [expense])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <DatePicker
                sx={textFieldStyle}
                onAccept={(newValue) => {
                    setDate(newValue.format('YYYY-MM-DD'))

                    const { ...updatedExpense } = expense
                    updatedExpense.date = newValue.format('YYYY-MM-DD')
                    updatedExpense.amount = amount
                    handleSave(updatedExpense)
                }}
                value={dayjs(date)}
                slotProps={{
                    textField: {
                        size: "small",
                        onChange: (newValue) => {
                            setDate(newValue.format('YYYY-MM-DD'))
                        },
                        onBlur: () => {
                            const { ...updatedExpense } = expense
                            updatedExpense.date = date
                            updatedExpense.amount = amount
                            handleSave(updatedExpense)
                        }
                    }
                }}
                format="DD-MM-YYYY" />
            <TextField
                variant="outlined"
                sx={textFieldStyle}
                size="small"
                value={amount}
                onChange={(event) => {
                    const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/;
                    if (event.target.value === "" || regex.test(event.target.value)) {
                        setAmount(event.target.value)
                    }
                }}
                onBlur={() => {
                    const { ...updatedExpense } = expense
                    updatedExpense.date = date
                    updatedExpense.amount = amount
                    handleSave(updatedExpense)
                }}
            />
            <IconButton onClick={handleDelete} style={{ "margin-left": "auto"}}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default Transaction

