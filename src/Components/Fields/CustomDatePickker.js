import React, { useState } from "react"
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers"
import { textFieldStyle } from "../../style";
import { getFormattedDate } from "../../helpers";

const CustomDatePickker = ({ date, setDate, label }) => {
    const [internalData, setInternalDate] = useState(getFormattedDate(date))

    const save = (newValue) => {
        const newDate = new Date(newValue)
        if (isNaN(newDate)) {
            console.log("Invalid startDate", newValue)
            return
        }
        setDate(newDate)
    }

    return (
        <DatePicker
            sx={textFieldStyle}
            label={label}
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

export default CustomDatePickker

