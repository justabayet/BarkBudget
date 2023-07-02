import React from 'react'

import { Box } from '@mui/material'

import ButtonAction from './ButtonAction'
import Title from './Title'


const Header = (): JSX.Element => {
    return (
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title />
            <ButtonAction />
        </Box>
    )
}


export default Header