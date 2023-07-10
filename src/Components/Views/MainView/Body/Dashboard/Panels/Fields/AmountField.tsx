import React, { useState } from 'react'

import { TextField } from '@mui/material'

import { useDeviceDetails } from 'Providers'

import { textFieldStyle } from 'style'


interface AmountFieldProps {
    amount: number
    setAmount: (newAmount: number) => void
    label?: string
}

const AmountField = ({ amount, setAmount, label }: AmountFieldProps): JSX.Element => {
    const [internalAmount, setInternalAmount] = useState<string>(amount.toString())
    const { isBodyFullSize } = useDeviceDetails()

    const maxWidth = isBodyFullSize ? 180 : 120

    const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/

    const save = () => {
        if (!internalAmount || internalAmount === '-') {
            setAmount(0)
            setInternalAmount('0')
        } else if (regex.test(internalAmount)) {
            setAmount(parseInt(internalAmount))
        }
    }

    return (
        <TextField
            variant='outlined'
            sx={{ ...textFieldStyle, maxWidth }}
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

