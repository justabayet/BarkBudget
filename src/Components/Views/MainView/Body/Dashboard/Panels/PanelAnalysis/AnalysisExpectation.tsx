import React from 'react'

import { Box, Card, CardContent, Chip, Typography } from '@mui/material'

interface AnalysisExpectationProps {
    amount: number
    label: string
}

const AnalysisExpectation = ({ amount, label }: AnalysisExpectationProps): JSX.Element => {
    return (
        <Card elevation={3}>
            <CardContent sx={{ p: 2 }}>
                <Box flexDirection={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>{label}</Typography>
                    <Chip label={amount} color={amount < 0 ? 'error' : 'success'} variant="outlined" />
                </Box>
            </CardContent>
        </Card>
    )
}


export default AnalysisExpectation