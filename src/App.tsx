/* eslint-disable no-restricted-globals */
import React from 'react'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import {
    AuthenticationProvider,
    DeviceDetailsProvider,
    FirebaseRepositoryProvider,
    GraphProvider,
    LoadingStatusProvider,
    ScenariosProvider,
    ToggleThemeProvider
} from 'Providers'

import 'App.css'
import Router from 'Components/Router'


function App(): JSX.Element {
    if (screen.width <= 425) screen.orientation.lock('portrait').catch(reason => console.log(reason))

    return (
        <ToggleThemeProvider>
            <DeviceDetailsProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <GraphProvider>
                        <FirebaseRepositoryProvider>
                            <LoadingStatusProvider>
                                <AuthenticationProvider>
                                    <ScenariosProvider>
                                        <Router />
                                    </ScenariosProvider>
                                </AuthenticationProvider>
                            </LoadingStatusProvider>
                        </FirebaseRepositoryProvider>
                    </GraphProvider>
                </LocalizationProvider>
            </DeviceDetailsProvider>
        </ToggleThemeProvider>
    )
}

export default App
