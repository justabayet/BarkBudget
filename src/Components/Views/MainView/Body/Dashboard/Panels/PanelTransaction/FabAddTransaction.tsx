import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Box, Fab } from '@mui/material'

import { useDeviceDetails } from 'Providers'


interface FabAddTransactionProps {
    addValue: () => void
}

const FabAddTransaction = ({ addValue }: FabAddTransactionProps): JSX.Element => {
    const { isMobile, isBodyFullSize } = useDeviceDetails()

    if (isBodyFullSize) {
        return (
            <Box sx={{ position: 'sticky', top: 377, left: '100%', width: 0, height: 0 }}>
                <Fab sx={{ ml: '16px', mt: '-82px' }} color='info' aria-label='add' onClick={addValue}>
                    <AddIcon />
                </Fab>
            </Box>
        )

    } else {
        return (
            <Fab sx={{ position: 'fixed', bottom: isMobile ? 72 : 32, right: isMobile ? 16 : 32 }} color='info' aria-label='add' onClick={addValue}>
                <AddIcon />
            </Fab>
        )
    }
}


export default FabAddTransaction