import React from 'react'
import './App.css'
import { data } from './data'
import MainView from './Components/MainView'
import { AuthenticationProvider } from './Providers/AuthenticationProvider'
import { DatabaseProvider } from './Providers/DatabaseProvider'


function App() {

  return (
    <AuthenticationProvider>
      <DatabaseProvider>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
          <MainView data={data} />
        </div>
      </DatabaseProvider>
    </AuthenticationProvider>
  )
}

export default App
