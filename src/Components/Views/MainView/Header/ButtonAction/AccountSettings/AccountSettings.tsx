import { Settings } from '@mui/icons-material'
import { ListItemIcon, MenuItem } from '@mui/material'
import React from 'react'
import DialogAccountSettings from './DialogAccountSettings'


const AccountSettings = (): JSX.Element => {
    const [openDialog, setOpenDialog] = React.useState(false)

    const handleOpenDialog = () => setOpenDialog(true)
    const handleCloseDialog = () => setOpenDialog(false)

    return (
        <>
            <MenuItem onClick={handleOpenDialog}>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Settings
            </MenuItem>
            <DialogAccountSettings open={openDialog} close={handleCloseDialog} />
        </>
    )
}

export default AccountSettings