


import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { ListItemIcon, Switch, useTheme } from '@mui/material'
import React from 'react'
import { useToggleTheme } from '../Providers/ToggleThemeProvider'

const DarkModeSwitch = (): JSX.Element => {
    const theme = useTheme()
    const { toggleTheme } = useToggleTheme()

    return (
        <>
            <ListItemIcon>
                {theme.palette.mode === 'light' ? <LightModeIcon fontSize='small' /> : <DarkModeIcon fontSize='small' />}
            </ListItemIcon>
            <Switch checked={theme.palette.mode === 'dark'} onClick={toggleTheme}></Switch>
        </>
    )
}

export default DarkModeSwitch