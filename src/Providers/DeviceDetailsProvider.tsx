import React, { createContext, useContext, useEffect, useState } from 'react'


class DeviceDetails {
    isMobile: boolean
    isBodyFullSize: boolean

    constructor(isMobile: boolean, isBodyFullSize: boolean) {
        this.isMobile = isMobile
        this.isBodyFullSize = isBodyFullSize
    }
}

const DeviceDetailsContext = createContext(new DeviceDetails(false, false))

const testIsMobile = (windowSize: number) => windowSize <= 425
const testIsBodyFullSize = (windowSize: number) => windowSize <= 600

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

    return (
        <DeviceDetailsContext.Provider value={new DeviceDetails(isMobile, isBodyFullSize)}>
            {children}
        </DeviceDetailsContext.Provider>
    )
}

export const useDeviceDetails = () => {
    return useContext(DeviceDetailsContext)
}