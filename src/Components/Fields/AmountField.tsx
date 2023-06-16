import { TextField } from "@mui/material"
import React, { useState } from "react"
import { useDeviceDetails } from "../../Providers/DeviceDetailsProvider"
import { textFieldStyle } from "../../style"

interface AmountFieldProps {
    amount: number
    setAmount: (newAmount: number) => void
    label?: string
}

const AmountField = ({ amount, setAmount, label }: AmountFieldProps): JSX.Element => {
    const [internalAmount, setInternalAmount] = useState<string>(amount.toString())
    const { isBodyFullSize } = useDeviceDetails()

    const maxWidth = isBodyFullSize ? 120 : 180

    const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/

    return (
        <TextField
            variant="outlined"
            sx={{ ...textFieldStyle, maxWidth }}
            size="small"
            value={internalAmount}
            label={label}
            onFocus={event => {
                event.target.select();
            }}
            onChange={(event) => {
                setInternalAmount(event.target.value)
            }}
            onBlur={() => {
                if (regex.test(internalAmount)) {
                    setAmount(parseInt(internalAmount))
                }
            }}
        />
    )
}

export default AmountField

