import React, { useState } from 'react'

import { TextField } from '@mui/material'

import { textFieldStyle } from 'style'
import { FieldComponent } from './InterfaceField'

const CustomTextField: FieldComponent<string> = ({ value, setValue, label }) => {
    const [internalText, setInternalText] = useState<string>(value.toString())

    return (
        <TextField
            variant='outlined'
            sx={{ ...textFieldStyle }}
            size='small'
            value={internalText}
            label={label}
            onChange={(event) => {
                setInternalText(event.target.value)
            }}
            onBlur={() => {
                setValue(internalText)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    setValue(internalText)
                }
            }}
            onFocus={event => {
                event.target.select();
            }}
        />
    )
}

export default CustomTextField

