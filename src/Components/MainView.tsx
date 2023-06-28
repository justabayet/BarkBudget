import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import { useScenarios } from '../Providers/ScenariosProvider'
import LoggedInView from './LoggedInView'
import LoginPage from './LoginPage'


const MainView = (): JSX.Element => {
    const { userDoc } = useAuthentication()
    const { scenarios } = useScenarios()

    return (
        <>
            {userDoc && !!scenarios ? <LoggedInView /> : <LoginPage />}
        </>
    )
}

export default MainView