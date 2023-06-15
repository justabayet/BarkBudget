import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs'
import React, { useState } from "react"
import { useDeviceDetails } from "../../Providers/DeviceDetailsProvider"
import { getFormattedDate } from "../../helpers"
import { textFieldStyle } from "../../style"

interface CustomDatePickerProps {
    date: Date
    setDate: (newDate: Date) => void
    label?: string
}

const CustomDatePicker = ({ date, setDate, label }: CustomDatePickerProps): JSX.Element => {
    const [internalData, setInternalDate] = useState<string | undefined>(getFormattedDate(date))
    const { isBodyFullSize } = useDeviceDetails()

    const maxWidth = isBodyFullSize ? 120 : 180

    const save = (newValue: string | undefined) => {
        if (newValue === undefined) {
            console.log("Invalid startDate", newValue)
            return
        }
        const newDate = new Date(newValue)
        setDate(newDate)
    }

    return (
        <DatePicker
            sx={{ ...textFieldStyle, maxWidth }}
            label={label}
            onAccept={(newValue) => {
                const formattedDate = newValue?.format('YYYY-MM-DD')
                setInternalDate(formattedDate)

                save(formattedDate)
            }}
            value={dayjs(internalData)}
            slotProps={{
                textField: {
                    size: "small",
                    onChange: (newValue) => {
                        setInternalDate((newValue as any as dayjs.Dayjs)?.format('YYYY-MM-DD'))
                    },
                    onBlur: () => {
                        save(internalData)
                    }
                }
            }}
            format="DD-MM-YYYY" />
    )
}

export default CustomDatePicker

