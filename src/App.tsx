/* eslint-disable no-restricted-globals */
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import './App.css'
import MainView from './Components/MainView'
import { AuthenticationProvider } from './Providers/AuthenticationProvider'
import { DeviceDetailsProvider } from './Providers/DeviceDetailsProvider'
import { GraphProvider } from './Providers/GraphProvider'
import { ToggleThemeProvider } from './Providers/ToggleThemeProvider'


function App(): JSX.Element {
    try {
        if (screen.width <= 425) screen.orientation.lock('portrait')
    } catch (error) {
        console.log("screen.orientation.lock('portrait'): Can't be called on this device")
    }

    return (
        <ToggleThemeProvider>
            <DeviceDetailsProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <GraphProvider>
                        <AuthenticationProvider>
                            <MainView />
                        </AuthenticationProvider>
                    </GraphProvider>
                </LocalizationProvider>
            </DeviceDetailsProvider>
        </ToggleThemeProvider>
    )
}

export default App
