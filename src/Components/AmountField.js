import React, { useState } from "react"
import { textFieldStyle } from "../style";
import { TextField } from "@mui/material";

const AmountField = ({ amount, setAmount }) => {
    const [internalAmount, setInternalAmount] = useState(amount)

    return (
        <TextField
            variant="outlined"
            sx={textFieldStyle}
            size="small"
            value={internalAmount}
            onChange={(event) => {
                const regex = /^(?!^0\d)-?\d*\.?\d*$|^$/;
                if (event.target.value === "" || regex.test(event.target.value)) {
                    setInternalAmount(parseInt(event.target.value))
                }
            }}
            onBlur={() => { setAmount(internalAmount) }}
        />
    )
}

export default AmountField

