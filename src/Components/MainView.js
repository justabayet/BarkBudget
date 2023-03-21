import React from 'react'
import { Typography } from '@mui/material'
import Authentication from './Authentication'
import TransactionDashboard from './TransactionDashboard'
import ExpenseGraph from './ExpenseGraph'
import { useAuthentication } from '../Providers/AuthenticationProvider'

const MainView = ({ data }) => {
    const { user } = useAuthentication()

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typography variant="h4" style={{ marginRight: 20 }}>
                    Welcome to INAB
                </Typography>

                <Authentication />
            </div>

            <ExpenseGraph data={data} />

            {user &&
                <TransactionDashboard />
            }
        </>
    )
}

export default MainView