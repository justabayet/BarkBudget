import React from 'react'
import { Typography, Button } from '@mui/material'
import { useAuthentication } from '../Providers/AuthenticationProvider'

const Authentication = () => {
    const { user, handleSignIn, handleSignOut } = useAuthentication()

    return (
        <>
            {user ? (
                <div>
                    <Typography variant="subtitle1" style={{ marginRight: 20 }}>
                        Signed in as {user.displayName}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </div>
            ) : (
                <Button variant="contained" color="primary" onClick={handleSignIn}>
                    Sign In with Google
                </Button>
            )}
        </>
    )
}

export default Authentication