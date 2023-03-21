import React, { useEffect, useState } from "react"
import { IconButton, TableCell, TableRow, TextField } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { getFormattedDate } from "../helpers"

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


    const Field = (value, fieldSetter) => {
        return (
            <TextField
                variant="outlined"
                sx={textFieldStyle}
                size="small"
                value={value}
                onChange={(event) => fieldSetter(event.target.value)}
                onBlur={() => {
                    const { ...updatedExpense } = expense
                    updatedExpense.date = date
                    updatedExpense.amount = amount
                    handleSave(updatedExpense)
                }}
            />
        )
    }

    return (
        <TableRow key={index}>
            <TableCell>
                {Field(date, setDate)}
            </TableCell>
            <TableCell>
                {Field(amount, setAmount)}
            </TableCell>
            <TableCell align="right">
                <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default Transaction

