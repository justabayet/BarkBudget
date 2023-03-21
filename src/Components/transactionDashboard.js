import React, { useState } from 'react'
import { Tabs, Tab, Box, Typography } from '@mui/material'
import TransactionList from './TransactionList'

const TransactionsDashboard = ({ expenses, targets, values }) => {
    const [tabIndex, setTabIndex] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
    }

    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="h4">Data</Typography>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs" variant='fullWidth'>
                <Tab label="Expenses" />
                <Tab label="Targets" />
                <Tab label="Values" />
            </Tabs>
            <Box sx={{ p: 1, width: '100%' }}>
                {tabIndex === 0 && <TransactionList expenses={expenses} />}
                {tabIndex === 1 && <TransactionList expenses={targets} />}
                {tabIndex === 2 && <TransactionList expenses={values} />}
            </Box>
        </Box>
    )
}

export default TransactionsDashboard