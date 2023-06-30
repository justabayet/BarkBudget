import { Logout } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Box, Button, ButtonBase, Collapse, Dialog, DialogContent, DialogTitle, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React from 'react'
import { useAuthentication } from '../Providers/AuthenticationProvider'
import DarkModeSwitch from './DarkModeSwitch'
import GoogleIcon from './GoogleLogo'

const Authentication = (): JSX.Element => {
    const { user, handleSignOut, handleSignIn, deleteAccount } = useAuthentication()
    const theme = useTheme()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const [openDialog, setOpenDialog] = React.useState(false)

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: theme.palette.primary.main
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        }
    }

    const [expanded, setExpanded] = React.useState(false)

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                {user ?
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}>

                            <Avatar {...stringAvatar(user!.displayName!)} />
                        </IconButton>
                    </Tooltip> :

                    <Tooltip title="Log in">
                        <IconButton
                            onClick={handleSignIn}
                            size="small"
                            sx={{ ml: 2 }}>

                            <GoogleIcon sx={{ width: 45, height: 45 }} />
                        </IconButton>
                    </Tooltip>
                }
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem disableRipple>
                    <DarkModeSwitch />
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleOpenDialog}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>

                <MenuItem onClick={() => { handleClose(); handleSignOut() }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle id="settings-dialog">
                    <Box display="flex" alignItems="center">
                        <Typography variant='h5'>Account Settings</Typography>

                        <IconButton onClick={handleCloseDialog} sx={{ ml: 'auto' }}>
                            <CloseIcon />
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
                                <ExpandMoreIcon sx={{ transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)', ml: 1 }} />
                            </ButtonBase>

                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <Stack sx={{ mt: 2 }} spacing={1}>
                                    <Box style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <ReportProblemIcon fontSize='small' sx={{ mt: -1, mr: 1 }} />
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
        </React.Fragment>
    )
}

export default Authentication