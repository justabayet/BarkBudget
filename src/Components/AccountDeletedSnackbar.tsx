import { Alert, Snackbar } from '@mui/material'
import React from 'react'

interface AccountDeletedSnackbarProps {
    eventOpen: boolean
    setEventOpen: (newEventOpen: boolean) => void
}

const AccountDeletedSnackbar = ({ eventOpen, setEventOpen }: AccountDeletedSnackbarProps): JSX.Element => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setEventOpen(false)
    }

    return (
        <Snackbar open={eventOpen} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                Account deleted successfully
            </Alert>
        </Snackbar>
    )
}

export default AccountDeletedSnackbar