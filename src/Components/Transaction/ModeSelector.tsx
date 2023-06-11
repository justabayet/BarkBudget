import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { modeNames } from "../../Modes/const";
import { textFieldStyle } from "../../style";

interface ModeSelectorProps {
    mode: string
    setMode: (newMode: string) => void
}

const ModeSelector = ({ mode, setMode }: ModeSelectorProps): JSX.Element => {

    return (
        <FormControl sx={{ m: 1, minWidth: 120, ...textFieldStyle }} size="small">
            <Select
                value={mode}
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

