import React from 'react'

import { useAuthentication, useScenarios } from 'Providers'

import { LoginView, MainView } from 'Components/Views'


const Router = (): JSX.Element => {
    const { userDoc } = useAuthentication()
    const { scenarios } = useScenarios()
    const loggedIn = userDoc && !!scenarios

    return loggedIn ? <MainView /> : <LoginView />
}

export default Router