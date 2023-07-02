import { Box, Typography } from '@mui/material'
import React from 'react'

const ScenariosNotFound = (): JSX.Element => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }} gap={2}>
            <Typography>
                Sadly our good boy 🐶 didn't find anything<br />
                Try to refresh the page
            </Typography>
        </Box>
    )
}

export default ScenariosNotFound