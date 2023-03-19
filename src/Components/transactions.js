import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';

function Transactions({ transactions }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Transactions
            </Typography>
            <List>
                {transactions.map((transaction, index) => (
                    <ListItemButton key={index} onClick={() => setSelectedTransaction(transaction)}>
                        <ListItemText primary={transaction} />
                    </ListItemButton>
                ))}
            </List>
            {selectedTransaction && (
                <div style={{ backgroundColor: '#fff', padding: 20, borderTop: '1px solid #ddd' }}>
                    <div>
                        <h2>{selectedTransaction}</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transactions;
