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

const Transaction = ({ value, handleDelete, handleSave }) => {
    const [date, setDate] = useState(getFormattedDate(value.date))
    const [amount, setAmount] = useState(value.amount)

    useEffect(() => {
        setDate(getFormattedDate(value.date))
        setAmount(value.amount)
    }, [value])

    const save = () => {
        const newDate = new Date(date)
        if(isNaN(newDate)) {
            console.log("Invalid date", date)
            return
        }
        const { ...updatedValue } = value
        updatedValue.date = newDate
        updatedValue.amount = amount
        handleSave(updatedValue)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <DatePicker
                sx={textFieldStyle}
                onAccept={(newValue) => {
                    setDate(newValue.format('YYYY-MM-DD'))

                    const { ...updatedValue } = value
                    updatedValue.date = new Date(newValue)
                    updatedValue.amount = amount
                    handleSave(updatedValue)
                }}
                value={dayjs(date)}
                slotProps={{
                    textField: {
                        size: "small",
                        onChange: (newValue) => {
                            setDate(newValue.format('YYYY-MM-DD'))
                        },
                        onBlur: save
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
                onBlur={save}
            />
            <IconButton onClick={handleDelete} style={{ "marginLeft": "auto"}}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default Transaction

