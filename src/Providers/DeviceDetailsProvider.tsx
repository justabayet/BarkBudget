import React, { createContext, useContext, useEffect, useState } from 'react'


class DeviceDetails {
    isMobile: boolean

    constructor(isMobile: boolean) {
        this.isMobile = isMobile
    }
}

const DeviceDetailsContext = createContext(new DeviceDetails(false))

export const DeviceDetailsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [isMobile, setIsMobile] = useState(false)

    const handleResize = () => {
        if (window.innerWidth <= 425) {
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