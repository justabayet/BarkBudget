import React, { useState } from "react"
import { textFieldStyle } from "../../style"
import { TextField } from "@mui/material"

interface AmountFieldProps {
    amount: number
    setAmount: (newAmount: number) => void
}

const AmountField = ({ amount, setAmount }: AmountFieldProps): JSX.Element => {
    const [internalAmount, setInternalAmount] = useState<string>(amount.toString())

    const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/

    return (
        <TextField
            variant="outlined"
            sx={textFieldStyle}
            size="small"
            value={internalAmount}
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

