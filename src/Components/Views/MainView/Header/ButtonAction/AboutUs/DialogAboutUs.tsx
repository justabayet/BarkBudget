import React from 'react';

import Close from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';


interface DialogAboutUsProps {
    open: boolean
    close: () => void
}

const DialogAboutUs = ({ open, close }: DialogAboutUsProps): JSX.Element => {

    return (
        <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
            <DialogTitle id="settings-dialog">
                <Box display="flex" alignItems="center">
                    <Typography variant='h5'>About Us</Typography>

                    <IconButton onClick={close} sx={{ ml: 'auto' }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Stack gap={3}>
                    <Stack gap={1}>
                        <Typography variant='h6'>Main developer</Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography>Anthony Bayet</Typography>
                            <IconButton target="_blank" href='https://www.linkedin.com/in/anthony-bayet'>
                                <LinkedInIcon />
                            </IconButton>
                        </Stack>
                    </Stack>

                    <Stack gap={1}>
                        <Typography variant='h6'>Project links</Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <IconButton target="_blank" href='https://github.com/justabayet/BarkBudget'>
                                <GitHubIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}


export default DialogAboutUs