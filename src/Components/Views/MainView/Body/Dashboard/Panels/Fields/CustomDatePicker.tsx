import React, { useState } from 'react'

import { DatePicker } from '@mui/x-date-pickers'

import dayjs from 'dayjs'

import { useDeviceDetails } from 'Providers'
import { getFormattedDate } from 'helpers'

import { textFieldStyle } from 'style'
import { FieldComponent } from './InterfaceField'

const CustomDatePicker: FieldComponent<Date> = ({ value, setValue, label }) => {
    const [internalData, setInternalDate] = useState<string | undefined>(getFormattedDate(value))
    const { isBodyFullSize } = useDeviceDetails()

    const maxWidth = isBodyFullSize ? 150 : 120

    const save = (newValue: string | undefined) => {
        if (newValue === undefined) {
            console.log('Invalid startDate', newValue)
            return
        }
        const newDate = new Date(newValue)
        setValue(newDate)
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
                    size: 'small',
                    onChange: (newValue) => {
                        setInternalDate((newValue as any as dayjs.Dayjs)?.format('YYYY-MM-DD'))
                    },
                    onBlur: () => {
                        save(internalData)
                    },
                    onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            save(internalData)
                        }
                    }
                }
            }}
            format='DD-MM-YYYY' />
    )
}


export default CustomDatePicker
