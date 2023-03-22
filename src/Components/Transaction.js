import React, { useEffect, useState } from "react"
import { IconButton, TableCell, TableRow, TextField } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { getFormattedDate } from "../helpers"
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { actionButtonStyle, tableCellStyle } from "./TransactionList";

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

const Transaction = ({ expense, index, handleDelete, handleSave }) => {
    const [date, setDate] = useState(getFormattedDate(new Date(expense.date)))
    const [amount, setAmount] = useState(expense.amount)

    useEffect(() => {
        const formattedDate = getFormattedDate(new Date(expense.date))
        setDate(formattedDate)
        setAmount(expense.amount)
    }, [expense])

    return (
        <TableRow key={index}>
            <TableCell style={tableCellStyle}>
                <DatePicker 
                    sx={textFieldStyle}
                    onChange={(newValue) => setDate(newValue.format('YYYY-MM-DD'))}
                    value={dayjs(date)}
                    onBlur={() => {
                        const { ...updatedExpense } = expense
                        updatedExpense.date = date
                        updatedExpense.amount = amount
                        handleSave(updatedExpense)
                    }}
                    slotProps={{ textField: { size:"small" } }}
                    format="DD-MM-YYYY"/>
            </TableCell>
            <TableCell style={tableCellStyle}>
                <TextField
                    variant="outlined"
                    sx={textFieldStyle}
                    size="small"
                    value={amount}
                    onChange={(event) => {
                        const regex =  /^(?!^0\d)-?\d*\.?\d*$|^$/;
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
            </TableCell>
            <TableCell align="right" style={actionButtonStyle}>
                <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default Transaction

