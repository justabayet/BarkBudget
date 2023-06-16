import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React from 'react'
import Authentication from './Authentication'
import './MainHeader.css'

const MainHeader = (): JSX.Element => {
    const theme = useTheme()
    const fileSuffix = theme.palette.mode === "dark" ? 'primary' : 'secondary'

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Box sx={{
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
            }} gap={2}>
                <img className='logo' src={`./images/logo-${fileSuffix}.svg`} alt="BarkBudget logo" />
                <img className='wordmark' src={`./images/wordmark-${fileSuffix}.svg`} alt="BarkBudget wordmark" />
            </Box>

            <Authentication />
        </div>
    )
}

export default MainHeader