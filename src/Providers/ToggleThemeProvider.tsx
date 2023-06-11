import { PaletteMode } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { grey } from '@mui/material/colors'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import React, { createContext, useContext } from 'react'


const primary = {
    main: '#9a9aff'
}

const secondary = {
    main: '#04003d'
}

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: secondary,
                secondary: primary,
                text: {
                    primary: grey[900],
                    secondary: grey[800],
                },
                background: {
                    default: '#fff',
                    paper: '#fff'
                }
            }
            : {
                // palette values for dark mode
                primary: primary,
                secondary: secondary,
                background: {
                    default: secondary.main,
                },
                text: {
                    primary: grey[200],
                    secondary: grey[300],
                },
            }),
    },
})

class ToggleTheme {
    toggleTheme: () => void

    constructor(toggleTheme: () => void) {
        this.toggleTheme = toggleTheme
    }
}

const ToggleThemeContext = createContext(new ToggleTheme(() => { }))

export const ToggleThemeProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
        () => ({
            toggleTheme: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    )

    const theme = React.useMemo(
        () =>
            createTheme(getDesignTokens(mode)),
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