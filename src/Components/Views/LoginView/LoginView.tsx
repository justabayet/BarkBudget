import React from 'react'

import { Box, Button, IconButton, useTheme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { grey } from '@mui/material/colors'

import { DarkModeSwitch, GoogleIcon } from 'Components/Shared'
import { useAuthentication, useLoadingStatus } from 'Providers'


const LoginPage = (): JSX.Element => {
    const { handleSignIn, signInTestAccount } = useAuthentication()
    const theme = useTheme()
    const fileSuffix = theme.palette.mode === 'dark' ? 'primary' : 'secondary'

    const { scenariosLoading, signingIn } = useLoadingStatus()
    const { userDoc } = useAuthentication()
    const loading = signingIn || (!!userDoc && scenariosLoading)

    return (
        <>
            <DarkModeSwitch sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                '&:hover': { backgroundColor: 'inherit' },
                cursor: 'default',
                padding: 1
            }} />
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
                <img className='loginLogo' src={`./images/combination-mark-${fileSuffix}.svg`} alt='BarkBudget logo' />
                <IconButton disabled={loading} sx={{ margin: 'auto' }} onClick={handleSignIn}>
                    <GoogleIcon sx={{ fontSize: '65px' }} />

                    {loading && (
                        <CircularProgress
                            size={80}
                            sx={{
                                color: grey[300],
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                opacity: 0.5
                            }}
                        />
                    )}
                </IconButton>
                <Button sx={{ position: 'fixed', bottom: 20, left: '50vw', transform: 'translateX(-50%)' }} size='small' onClick={signInTestAccount} variant='outlined'>
                    Test as a Guest?
                </Button>
            </Box>

        </>
    )
}

export default LoginPage