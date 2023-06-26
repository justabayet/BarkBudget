import { Box, Button, IconButton, useTheme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { grey } from '@mui/material/colors'
import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import GoogleIcon from './GoogleLogo'

const LoginPage = (): JSX.Element => {
    const { handleSignIn, signInTestAccount, signingIn } = useAuthentication()
    const theme = useTheme()
    const fileSuffix = theme.palette.mode === "dark" ? 'primary' : 'secondary'

    console.log("##", signingIn)

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

                {signingIn && (
                    <CircularProgress
                        size={70}
                        sx={{
                            color: grey[300],
                            position: 'absolute',
                            top: '13px',
                            left: '13px',
                        }}
                    />
                )}
            </IconButton>
            <Button sx={{ position: 'fixed', bottom: 20, left: '50vw', transform: 'translateX(-50%)' }} size='small' onClick={signInTestAccount} variant='outlined'>
                Test as a Guest?
            </Button>
        </Box>
    )
}

export default LoginPage