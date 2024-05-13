
import React from 'react'

import Logout from '@mui/icons-material/Logout'
import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material'

import { DarkModeSwitch } from 'Components/Shared'
import { useAuthentication } from 'Providers'
import AboutUs from './AboutUs'
import AccountSettings from './AccountSettings'


interface MenuCustomProps {
    anchorEl: null | HTMLElement
    handleCloseMenu: () => void
}

const MenuCustom = ({ anchorEl, handleCloseMenu }: MenuCustomProps): JSX.Element => {
    const { handleSignOut } = useAuthentication()

    const open = Boolean(anchorEl)

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleCloseMenu}

            disableScrollLock
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <DarkModeSwitch />

            <AboutUs />

            <Divider />

            <AccountSettings />

            <MenuItem onClick={() => { handleCloseMenu(); handleSignOut() }}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    )
}


export default MenuCustom