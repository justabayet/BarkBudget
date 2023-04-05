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

const TransactionDatePickker = ({ initialDate, saveDate }) => {
    const [internalData, setInternalDate] = useState(initialDate)

    const save = (newValue) => {
        const newDate = new Date(newValue)
        if (isNaN(newDate)) {
            console.log("Invalid startDate", newValue)
            return
        }
        saveDate(newDate)
    }

    return (
        <DatePicker
            sx={textFieldStyle}
            onAccept={(newValue) => {
                const formattedDate = newValue.format('YYYY-MM-DD')
                setInternalDate(formattedDate)

                save(formattedDate)
            }}
            value={dayjs(internalData)}
            slotProps={{
                textField: {
                    size: "small",
                    onChange: (newValue) => {
                        setInternalDate(newValue.format('YYYY-MM-DD'))
                    },
                    onBlur: () => {
                        save(internalData)
                    }
                }
            }}
            format="DD-MM-YYYY" />
    )
}

export default TransactionDatePickker

