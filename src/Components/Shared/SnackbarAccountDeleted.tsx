import React from 'react'

import { Alert, Snackbar } from '@mui/material'


interface SnackbarAccountDeletedProps {
    eventOpen: boolean
    setEventOpen: (newEventOpen: boolean) => void
}

const SnackbarAccountDeleted = ({ eventOpen, setEventOpen }: SnackbarAccountDeletedProps): JSX.Element => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return

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


export default SnackbarAccountDeleted