import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'


class DeviceDetails {
    constructor(public isMobile: boolean, public isBodyFullSize: boolean) { }
}

const DeviceDetailsContext = createContext(new DeviceDetails(false, false))

const testIsMobile = (windowSize: number) => windowSize <= 425
const testIsBodyFullSize = (windowSize: number) => windowSize >= 600

export const DeviceDetailsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [isMobile, setIsMobile] = useState(testIsMobile(window.innerWidth))
    const [isBodyFullSize, setIsBodyFullSize] = useState(testIsBodyFullSize(window.innerWidth))

    const handleResize = () => {
        setIsMobile(testIsMobile(window.innerWidth))
        setIsBodyFullSize(testIsBodyFullSize(window.innerWidth))
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    })

    const value = useMemo(() => new DeviceDetails(isMobile, isBodyFullSize), [isMobile, isBodyFullSize])

    return (
        <DeviceDetailsContext.Provider value={value}>
            {children}
        </DeviceDetailsContext.Provider>
    )
}

export const useDeviceDetails = () => {
    return useContext(DeviceDetailsContext)
}