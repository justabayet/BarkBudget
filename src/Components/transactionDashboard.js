import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import TransactionList from './transactionList';

const TransactionsDashboard = ({ expenses, targets, values }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs">
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
    );
};

export default TransactionsDashboard;