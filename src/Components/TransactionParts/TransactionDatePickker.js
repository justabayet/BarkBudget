import React, { useState } from "react"
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers"

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

const TransactionDatePickker = ({ date, setDate }) => {
    const [internalData, setInternalDate] = useState(date)

    return (
        <DatePicker
            sx={textFieldStyle}
            onAccept={(newValue) => {
                const formattedDate = newValue.format('YYYY-MM-DD')
                setDate(formattedDate)
                setInternalDate(formattedDate)
            }}
            value={dayjs(internalData)}
            slotProps={{
                textField: {
                    size: "small",
                    onChange: (newValue) => {
                        setInternalDate(newValue.format('YYYY-MM-DD'))
                    },
                    onBlur: () => {
                        setDate(internalData)
                    }
                }
            }}
            format="DD-MM-YYYY" />
    )
}

export default TransactionDatePickker

