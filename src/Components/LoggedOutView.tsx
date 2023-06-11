import { Box, IconButton } from '@mui/material'
import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import GoogleIcon from './GoogleLogo'

const LoggedOutView = (): JSX.Element => {
    const { handleSignIn } = useAuthentication()

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
            <img className='loginLogo' src="./logo.svg" alt="BarkBudget logo" color='red' />
            <IconButton sx={{ margin: 'auto' }} onClick={handleSignIn}>
                <GoogleIcon sx={{ fontSize: '80px' }} />
            </IconButton>
        </Box>
    )
}

export default LoggedOutView