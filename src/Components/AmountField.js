import React, { useState } from "react"
import { textFieldStyle } from "../style";
import { TextField } from "@mui/material";

const AmountField = ({ amount, setAmount }) => {
    const [internalAmount, setInternalAmount] = useState(amount)

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

