import React from 'react'

import { Person } from '@mui/icons-material'
import { Avatar, useTheme } from '@mui/material'

import { UserType } from 'Providers'


interface CustomAvatarProps {
    user: UserType
}

const CustomAvatar = ({ user }: CustomAvatarProps): JSX.Element => {
    const theme = useTheme()

    return (
        <Avatar
            sx={{ bgcolor: theme.palette.primary.main }}
            alt={user.displayName || undefined}
            src={user.photoURL || undefined}>
            <Person />
        </Avatar>
    )
}


export default CustomAvatar