import InfoIcon from '@mui/icons-material/Info';
import { ListItemIcon, MenuItem } from '@mui/material';
import React from 'react';
import DialogAboutUs from './DialogAboutUs';


const AboutUs = (): JSX.Element => {
    const [openDialog, setOpenDialog] = React.useState(false)

    const handleOpenDialog = () => setOpenDialog(true)
    const handleCloseDialog = () => setOpenDialog(false)

    return (
        <>
            <MenuItem onClick={handleOpenDialog}>
                <ListItemIcon>
                    <InfoIcon fontSize="small" />
                </ListItemIcon>
                About us
            </MenuItem>
            <DialogAboutUs open={openDialog} close={handleCloseDialog} />
        </>
    )
}

export default AboutUs