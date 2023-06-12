import { Box, IconButton, useTheme } from '@mui/material'
import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import GoogleIcon from './GoogleLogo'

const LoggedOutView = (): JSX.Element => {
    const { handleSignIn } = useAuthentication()
    const theme = useTheme()
    const fileSuffix = theme.palette.mode === "dark" ? 'primary' : 'secondary'

    return (
        <Box sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 'calc(100vh-128px)',
            marginTop: '128px',
            flexDirection: 'column',
            flexWrap: 'wrap'
        }}>
            <img className='loginLogo' src={`./images/combination-mark-${fileSuffix}.svg`} alt="BarkBudget logo" />
            <IconButton sx={{ margin: 'auto' }} onClick={handleSignIn}>
                <GoogleIcon sx={{ fontSize: '80px' }} />
            </IconButton>
        </Box>
    )
}

export default LoggedOutView