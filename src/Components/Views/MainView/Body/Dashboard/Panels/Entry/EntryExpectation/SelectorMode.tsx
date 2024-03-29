import React from 'react'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { modeNames } from 'Modes/const'

import { textFieldStyle } from 'style'


interface SelectorModeProps {
    mode: string
    setMode: (newMode: string) => void
    label?: string
}

const SelectorMode = ({ mode, setMode, label }: SelectorModeProps): JSX.Element => {
    return (
        <FormControl sx={{ minWidth: 120, ...textFieldStyle }} size='small'>
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                value={mode}
                label={label}
                inputProps={{ MenuProps: { disableScrollLock: true } }}
                onChange={(event) => {
                    setMode(event.target.value)
                }} >

                {Object.values(modeNames).map(modeName => {
                    return (
                        <MenuItem value={modeName} key={modeName}>{modeName}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}


export default SelectorMode

