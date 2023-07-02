import React from 'react'

import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { ListItemIcon, MenuItem, MenuItemProps, Switch, useTheme } from '@mui/material'

import { useToggleTheme } from 'Providers/ToggleThemeProvider'


const DarkModeSwitch = (props: MenuItemProps): JSX.Element => {
    const theme = useTheme()
    const { toggleTheme } = useToggleTheme()

    return (
        <MenuItem disableRipple {...props}>
            <ListItemIcon>
                {theme.palette.mode === 'light' ? <LightModeIcon fontSize='small' /> : <DarkModeIcon fontSize='small' />}
            </ListItemIcon>

            <Switch checked={theme.palette.mode === 'dark'} onClick={toggleTheme}></Switch>
        </MenuItem>
    )
}


export default DarkModeSwitch