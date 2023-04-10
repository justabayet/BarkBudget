import React from 'react'
import { Typography, IconButton } from '@mui/material'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

const Authentication = () => {
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