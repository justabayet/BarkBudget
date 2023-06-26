import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import LoggedInView from './LoggedInView'
import LoginPage from './LoginPage'


const MainView = (): JSX.Element => {
    const { userDoc } = useAuthentication()

    return (
        <>
            {userDoc ? <LoggedInView /> : <LoginPage />}
        </>
    )
}

export default MainView