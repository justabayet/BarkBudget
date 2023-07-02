import React from 'react'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import './Title.css'


const Title = (): JSX.Element => {
    const theme = useTheme()

    return (
        <Box sx={{ display: 'flex' }} gap={2}>
            <img className='logo' src={`./images/logo-${theme.fileSuffix}.svg`} alt='BarkBudget logo' />
            <img className='wordmark' src={`./images/wordmark-${theme.fileSuffix}.svg`} alt='BarkBudget wordmark' />
        </Box>
    )
}


export default Title