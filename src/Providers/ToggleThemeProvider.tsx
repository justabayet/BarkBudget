import React, { createContext, useContext } from 'react'

import { PaletteMode } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'


declare module '@mui/material/styles' {
    interface Theme {
        grid: {
            line: string
        },
        fileSuffix: string
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        grid: {
            line: string
        },
        fileSuffix: string
    }
}

const getDesignTokensDefault = (mode: PaletteMode) => ({
    palette: {
        mode,
    },
    ...(mode === 'light'
        ? {
            grid: {
                line: 'rgba(0, 0, 0, 0.1)'
            },
            fileSuffix: 'secondary'
        }
        : {
            grid: {
                line: 'rgba(255, 255, 255, 0.1)'
            },
            fileSuffix: 'primary'
        }),
})

class ToggleTheme {
    constructor(public toggleTheme: () => void) { }
}

const ToggleThemeContext = createContext(new ToggleTheme(() => { }))

export const ToggleThemeProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light')
    const colorMode = React.useMemo(
        () => ({
            toggleTheme: () => {
                setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
            },
        }),
        [],
    )

    const theme = React.useMemo(
        () =>
            createTheme(getDesignTokensDefault(mode)),
        [mode],
    )

    return (
        <ToggleThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ToggleThemeContext.Provider>
    )
}

export const useToggleTheme = () => {
    return useContext(ToggleThemeContext)
}