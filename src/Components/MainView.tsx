import React from 'react'
import { Typography } from '@mui/material'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import { ScenariosProvider } from '../Providers/ScenariosProvider'
import Body from './Body'
import MainHeader from './MainHeader'


const MainView = (): JSX.Element => {
    const { userDoc } = useAuthentication()

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <MainHeader />

            {!userDoc ? (
                <Typography>Login first</Typography>
            ) : (
                <ScenariosProvider>
                    <Body />
                </ScenariosProvider>
            )}
        </div>
    )
}

export default MainView