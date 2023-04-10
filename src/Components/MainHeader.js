import React from 'react'
import { Typography } from '@mui/material'
import Authentication from './Authentication'

const MainHeader = () => {

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Typography variant="h4" style={{ marginRight: 20 }}>
                BarkBudget
            </Typography>

            <Authentication />
        </div>
    )
}

export default MainHeader