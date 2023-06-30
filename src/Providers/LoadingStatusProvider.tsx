import React, { createContext, useContext, useState } from 'react'

type setter = (newValue: boolean) => void

class LoadingStatus {
    constructor(
        public isLoading: boolean,
        public scenariosLoading: boolean,
        public signingIn: boolean,
        public currentScenarioLoading: boolean,
        public setScenariosLoading: setter,
        public setSigningIn: setter,
        public setCurrentScenarioLoading: setter,
    ) { }
}

const LoadingStatusContext = createContext(new LoadingStatus(false, false, false, false, () => { }, () => { }, () => { }))

export const LoadingStatusProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [scenariosLoading, setScenariosLoading] = useState<boolean>(false)
    const [signingIn, setSigningIn] = useState<boolean>(false)
    const [currentScenarioLoading, setCurrentScenarioLoading] = useState<boolean>(false)

    const isLoading = signingIn || scenariosLoading || !currentScenarioLoading

    return (
        <LoadingStatusContext.Provider value={new LoadingStatus(isLoading, scenariosLoading, signingIn, currentScenarioLoading, setScenariosLoading, setSigningIn, setCurrentScenarioLoading)}>
            {children}
        </LoadingStatusContext.Provider>
    )
}

export const useLoadingStatus = () => {
    return useContext(LoadingStatusContext)
}