import React from "react"
import { textFieldStyle } from "../style";
import { modeNames } from "../Modes/const";
import { MenuItem, Select, FormControl } from "@mui/material";

const ModeSelector = ({ mode, setMode }) => {

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

