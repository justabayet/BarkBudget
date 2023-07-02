import React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'


interface DialogDeleteScenarioProps {
    scenarioName: string
    handleCloseDeleteDialog: () => void
    openDeleteDialog: boolean
    setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogDeleteScenario = ({ scenarioName, handleCloseDeleteDialog, openDeleteDialog, setOpenDeleteDialog }: DialogDeleteScenarioProps): JSX.Element => {
    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const confirmDeleteDialog = () => {
        closeDeleteDialog()
        handleCloseDeleteDialog()
    }

    return (
        <Dialog
            disableScrollLock
            open={openDeleteDialog}
            onClose={closeDeleteDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'>

            <DialogTitle id='alert-dialog-title'>
                Delete scenario '{scenarioName}'?
            </DialogTitle>

            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    Deleting a scenario is irreversible
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ margin: 1 }}>
                <Button onClick={closeDeleteDialog} variant='outlined' autoFocus>Cancel</Button>
                <Button onClick={confirmDeleteDialog} variant='contained' color='error'>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}


export default DialogDeleteScenario