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
    const [startDate, setStartDate] = useState(getFormattedDate(value.startDate))
    const [endDate, setEndDate] = useState(getFormattedDate(value.endDate))
    const [amount, setAmount] = useState(value.amount)

    useEffect(() => {
        setStartDate(getFormattedDate(value.startDate))
        setEndDate(getFormattedDate(value.endDate))
        setAmount(value.amount)
    }, [value])

    const saveRef = useRef()
    saveRef.current = () => {
        console.log("saved", startDate)
        const newStartDate = new Date(startDate)
        if (isNaN(newStartDate)) {
            console.log("Invalid date", startDate)
            return
        }

        const newEndDate = new Date(endDate)
        if (isNaN(newEndDate)) {
            console.log("Invalid date", endDate)
            return
        }

        const { ...updatedValue } = value
        updatedValue.startDate = newStartDate
        updatedValue.endDate = newEndDate
        updatedValue.amount = amount
        handleSave(updatedValue)
    }

    useEffect(() => {
        saveRef.current()
    }, [saveRef, startDate])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <TransactionDatePickker date={startDate} setDate={setStartDate} />

            {/* <DatePicker
                sx={textFieldStyle}
                onAccept={(newValue) => {
                    setStartDate(newValue.format('YYYY-MM-DD'))

                    const newDate = new Date(newValue)
                    if (isNaN(newDate)) {
                        console.log("Invalid startDate", newValue)
                        return
                    }
                    const { ...updatedValue } = value
                    updatedValue.startDate = newDate
                    updatedValue.endDate = new Date(endDate)
                    updatedValue.amount = amount
                    handleSave(updatedValue)
                }}
                value={dayjs(startDate)}
                slotProps={{
                    textField: {
                        size: "small",
                        onChange: (newValue) => {
                            setStartDate(newValue.format('YYYY-MM-DD'))
                        },
                        onBlur: saveRef.current
                    }
                }}
                format="DD-MM-YYYY" /> */}

            <DatePicker
                sx={textFieldStyle}
                onAccept={(newValue) => {
                    setEndDate(newValue.format('YYYY-MM-DD'))

                    const newDate = new Date(newValue)
                    if (isNaN(newDate)) {
                        console.log("Invalid endDate", newValue)
                        return
                    }
                    const { ...updatedValue } = value
                    updatedValue.startDate = new Date(startDate)
                    updatedValue.endDate = newDate
                    updatedValue.amount = amount
                    handleSave(updatedValue)
                }}
                value={dayjs(endDate)}
                slotProps={{
                    textField: {
                        size: "small",
                        onChange: (newValue) => {
                            setEndDate(newValue.format('YYYY-MM-DD'))
                        },
                        onBlur: saveRef.current
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
                        setAmount(parseInt(event.target.value))
                    }
                }}
                onBlur={saveRef.current}
            />
            <IconButton onClick={handleDelete} style={{ "marginLeft": "auto" }}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default Expense

