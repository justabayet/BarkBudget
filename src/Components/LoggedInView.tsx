import React from 'react'
import { ScenariosProvider } from '../Providers/ScenariosProvider'
import Body from './Body'
import MainHeader from './MainHeader'


const LoggedInView = (): JSX.Element => {
    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <MainHeader />
            <ScenariosProvider>
                <Body />
            </ScenariosProvider>
        </div>
    )
}

export default LoggedInView