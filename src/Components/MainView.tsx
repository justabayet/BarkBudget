import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import LoggedInView from './LoggedInView'
import LoggedOutView from './LoggedOutView'


const MainView = (): JSX.Element => {
    const { userDoc } = useAuthentication()

    return (
        <>
            {userDoc ? <LoggedInView /> : <LoggedOutView />}
        </>
    )
}

export default MainView