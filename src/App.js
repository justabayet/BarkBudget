import React from 'react'
import './App.css'
import MainView from './Components/MainView'
import { AuthenticationProvider } from './Providers/AuthenticationProvider'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { GraphProvider } from './Providers/GraphProvider'

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GraphProvider>
        <AuthenticationProvider>
          <MainView />
        </AuthenticationProvider>
      </GraphProvider>
    </LocalizationProvider>
  )
}

export default App
