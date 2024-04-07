
import React from 'react'

import Close from '@mui/icons-material/Close'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ReportProblem from '@mui/icons-material/ReportProblem'
import { Box, Button, ButtonBase, Collapse, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'

import { useAuthentication } from 'Providers'


interface DialogAccountSettingsProps {
    open: boolean
    close: () => void
}

const DialogAccountSettings = ({ open, close }: DialogAccountSettingsProps): JSX.Element => {
    const { user, deleteAccount } = useAuthentication()

    const [expanded, setExpanded] = React.useState(false)

    return (
        <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
            <DialogTitle id="settings-dialog">
                <Box display="flex" alignItems="center">
                    <Typography variant='h5'>Account Menu</Typography>

                    <IconButton onClick={close} sx={{ ml: 'auto' }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3}>
                    <Stack>
                        <Typography>Google account in-use</Typography>
                        <Typography variant='caption'> {user?.email}</Typography>
                    </Stack>

                    <Stack>
                        <ButtonBase sx={{ justifyContent: 'flex-start' }} onClick={() => { setExpanded(expanded => !expanded) }}>
                            <Typography >Danger zone</Typography>
                            <ExpandMore sx={{ transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)', ml: 1 }} />
                        </ButtonBase>

                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <Stack sx={{ mt: 2 }} spacing={1}>
                                <Box style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <ReportProblem fontSize='small' sx={{ mt: -1, mr: 1 }} />
                                    <Typography variant='caption'> Actions are permanent in this zone</Typography>
                                </Box>

                                <Button color='error' variant='contained' size='small' sx={{ width: 'fit-content' }}
                                    onClick={deleteAccount}>Delete account</Button>
                            </Stack>
                        </Collapse>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}


export default DialogAccountSettings