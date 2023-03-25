import React from 'react'
import './App.css'
import MainView from './Components/MainView'
import { AuthenticationProvider } from './Providers/AuthenticationProvider'
import { UserDocProvider } from './Providers/UserDocProvider'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ScenariosProvider } from './Providers/ScenariosProvider'

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthenticationProvider>
        <UserDocProvider>
          <ScenariosProvider>
            <MainView />
          </ScenariosProvider>
        </UserDocProvider>
      </AuthenticationProvider>
    </LocalizationProvider>
  )
}

export default App
