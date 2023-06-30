import { TextField } from "@mui/material"
import React, { useState } from "react"
import { textFieldStyle } from "../../style"

interface CustomTextFieldProps {
    text: string
    setText: (newText: string) => void
    label?: string
}

const CustomTextField = ({ text, setText, label }: CustomTextFieldProps): JSX.Element => {
    const [internalText, setInternalText] = useState<string>(text.toString())

    return (
        <TextField
            variant="outlined"
            sx={{ ...textFieldStyle }}
            size="small"
            value={internalText}
            label={label}
            onChange={(event) => {
                setInternalText(event.target.value)
            }}
            onBlur={() => {
                setText(internalText)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    setText(internalText)
                }
            }}
        />
    )
}

export default CustomTextField

