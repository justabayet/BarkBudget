import React, { useEffect, useState } from "react"
import { IconButton, TableCell, TableRow, TextField } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'

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
    const [date, setDate] = useState(expense.date)
    const [amount, setAmount] = useState(expense.amount)

    useEffect(() => {
        setDate(expense.date)
        setAmount(expense.amount)
    }, [expense])


    const Field = (value, set) => {
        return (
            <TextField
                variant="outlined"
                sx={textFieldStyle}
                size="small"
                name="date"
                value={value}
                onChange={(event) => set(event.target.value)}
                onBlur={() => { handleSave(date, amount) }}
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

