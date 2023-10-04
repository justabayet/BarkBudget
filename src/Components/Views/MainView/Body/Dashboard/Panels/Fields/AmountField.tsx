import React, { useState } from 'react'

import { TextField } from '@mui/material'

import { useDeviceDetails } from 'Providers'

import { textFieldStyle } from 'style'
import { FieldComponent } from './InterfaceField'


const AmountField: FieldComponent<number> = ({ value, setValue, label }) => {
    const [internalAmount, setInternalAmount] = useState<string>(value.toString())
    const { isBodyFullSize } = useDeviceDetails()

    const maxWidth = isBodyFullSize ? 180 : 120

    const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/

    const save = () => {
        if (!internalAmount || internalAmount === '-') {
            setValue(0)
            setInternalAmount('0')
        } else if (regex.test(internalAmount)) {
            setValue(parseInt(internalAmount))
        }
    }

    return (
        <TextField
            variant='outlined'
            sx={{
                ...textFieldStyle, maxWidth, m: 0, "& .MuiInputBase-root": {
                    m: 0, p: 0
                }, "& MuiOutlinedInput-input": {
                    p: 0
                }
            }}
            size='small'
            value={internalAmount}
            label={label}
            onFocus={event => {
                event.target.select();
            }}
            onChange={(event) => {
                setInternalAmount(event.target.value)
            }}
            onBlur={save}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    save()
                }
            }}
            color={!regex.test(internalAmount) ? 'error' : 'primary'}
        />
    )
}


export default AmountField

