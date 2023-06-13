import React, { createContext, useContext, useEffect, useState } from 'react'


class DeviceDetails {
    isMobile: boolean

    constructor(isMobile: boolean) {
        this.isMobile = isMobile
    }
}

const DeviceDetailsContext = createContext(new DeviceDetails(false))

const testIsMobile = (windowSize: number) => windowSize <= 425

export const DeviceDetailsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [isMobile, setIsMobile] = useState(testIsMobile(window.innerWidth))

    const handleResize = () => {
        if (testIsMobile(window.innerWidth)) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    })

    return (
        <DeviceDetailsContext.Provider value={new DeviceDetails(isMobile)}>
            {children}
        </DeviceDetailsContext.Provider>
    )
}

export const useDeviceDetails = () => {
    return useContext(DeviceDetailsContext)
}