import React from 'react'

import { Avatar } from '@mui/material'
import { useTheme } from '@mui/material/styles'


interface CustomAvatarProps {
    name: string
}

const CustomAvatar = ({ name }: CustomAvatarProps): JSX.Element => {
    const theme = useTheme()

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: theme.palette.primary.main
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        }
    }

    return <Avatar {...stringAvatar(name)} />
}


export default CustomAvatar