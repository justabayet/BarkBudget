/* eslint-disable no-restricted-globals */
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import './App.css'
import MainView from './Components/MainView'
import { AuthenticationProvider } from './Providers/AuthenticationProvider'
import { DeviceDetailsProvider } from './Providers/DeviceDetailsProvider'
import { FirebaseRepositoryProvider } from './Providers/FirebaseRepositoryProvider'
import { GraphProvider } from './Providers/GraphProvider'
import { LoadingStatusProvider } from './Providers/LoadingStatusProvider'
import { ScenariosProvider } from './Providers/ScenariosProvider'
import { ToggleThemeProvider } from './Providers/ToggleThemeProvider'


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
                                        <MainView />
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
