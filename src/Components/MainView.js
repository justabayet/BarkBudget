import React, { useState } from 'react'
import { Typography, Button } from '@mui/material'
import Authentication from './Authentication'
import TransactionDashboard from './TransactionDashboard'
import ExpenseGraph from './ExpenseGraph'
import { useDatabase } from '../Providers/DatabaseProvider'
import { addDoc, collection, getDoc, setDoc } from 'firebase/firestore'

const MainView = ({ data }) => {

    const [transactions, setTransactions] = useState([])
    const { database } = useDatabase()

    const handleAddEntry = () => {
        const newTransactions = [...transactions, transactions.length + 1]
        const entry = {
            name: "Los Angeles",
            state: "CA",
            date: new Date(),
            country: "USA",
            cities: newTransactions
        }

        setDoc(database, entry)
        setTransactions(newTransactions)
        addDoc(collection(database, "values"), {
            date: "2023-09-01",
            amount: newTransactions.length
        })

    }

    const handleGetEntry = () => {
        getDoc(database)
            .then((querySnapshot) => {
                const entryData = querySnapshot.data()
                console.log("Get entry:", entryData)
                setTransactions(entryData.cities)
            })
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typography variant="h4" style={{ marginRight: 20 }}>
                    Welcome to INAB
                </Typography>

                <Authentication />
            </div>

            <ExpenseGraph data={data}></ExpenseGraph>

            <TransactionDashboard expenses={data} targets={data} values={data}></TransactionDashboard>

            <div style={{ marginBottom: 20 }}>
                <Button variant="contained" color="primary" style={{ marginRight: 10 }} onClick={handleAddEntry}>
                    Add Entry
                </Button>
                <Button variant="contained" color="primary" onClick={handleGetEntry}>
                    Get Entry
                </Button>
            </div>
        </>
    )
}

export default MainView