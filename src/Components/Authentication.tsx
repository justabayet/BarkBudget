import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { IconButton, Typography } from '@mui/material'
import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'

const Authentication = (): JSX.Element => {
    const { user, handleSignIn, handleSignOut } = useAuthentication()

    return (
        <>
            {user ? (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography variant="subtitle1" style={{ marginRight: 5 }}>
                        {user.displayName}
                    </Typography>
                    <IconButton color="error" onClick={handleSignOut}>
                        <LogoutIcon />
                    </IconButton>
                </div>
            ) : (
                <IconButton color="primary" onClick={handleSignIn}>
                    <LoginIcon />
                </IconButton>
            )}
        </>
    )
}

export default Authentication