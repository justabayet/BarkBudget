import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { modeNames } from "../../Modes/const";
import { textFieldStyle } from "../../style";

interface ModeSelectorProps {
    mode: string
    setMode: (newMode: string) => void
    label?: string
}

const ModeSelector = ({ mode, setMode, label }: ModeSelectorProps): JSX.Element => {

    return (
        <FormControl sx={{ minWidth: 120, ...textFieldStyle }} size="small">
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                value={mode}
                label={label}
                onChange={(event) => {
                    setMode(event.target.value)
                }}
            >
                {Object.values(modeNames).map(modeName => {
                    return (
                        <MenuItem value={modeName} key={modeName}>{modeName}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default ModeSelector

