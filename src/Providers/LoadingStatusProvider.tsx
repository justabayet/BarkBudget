import React, { createContext, useContext, useMemo, useState } from 'react'

type setter = React.Dispatch<React.SetStateAction<boolean>>

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

    const value = useMemo(
        () => new LoadingStatus(isLoading, scenariosLoading, signingIn, currentScenarioLoading, setScenariosLoading, setSigningIn, setCurrentScenarioLoading),
        [currentScenarioLoading, isLoading, scenariosLoading, signingIn]
    )

    return (
        <LoadingStatusContext.Provider value={value}>
            {children}
        </LoadingStatusContext.Provider>
    )
}

export const useLoadingStatus = () => {
    return useContext(LoadingStatusContext)
}