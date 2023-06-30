import { Box, Button, IconButton, useTheme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { grey } from '@mui/material/colors'
import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import { useLoadingStatus } from '../Providers/LoadingStatusProvider'
import GoogleIcon from './GoogleLogo'

const LoginPage = (): JSX.Element => {
    const { handleSignIn, signInTestAccount } = useAuthentication()
    const theme = useTheme()
    const fileSuffix = theme.palette.mode === "dark" ? 'primary' : 'secondary'

    const { scenariosLoading, signingIn } = useLoadingStatus()
    const { userDoc } = useAuthentication()
    const loading = signingIn || (!!userDoc && scenariosLoading)

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
            <IconButton disabled={loading} sx={{ margin: 'auto' }} onClick={handleSignIn}>
                <GoogleIcon sx={{ fontSize: '80px' }} />

                {loading && (
                    <CircularProgress
                        size={70}
                        sx={{
                            color: grey[300],
                            position: 'absolute',
                            top: '13.5px',
                            left: '13px',
                            opacity: 0.5
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