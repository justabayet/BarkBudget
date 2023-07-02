import React from 'react'

import { IconButton, Tooltip } from '@mui/material'


interface ButtonBodyProps {
    action: (() => void) | ((event: React.MouseEvent<HTMLElement>) => void)
    title: string
    Icon: JSX.Element
}

const ButtonBody = ({ action, title, Icon }: ButtonBodyProps): JSX.Element => {
    return (
        <Tooltip title={title}>
            <IconButton
                onClick={action}
                size="small"
                sx={{ ml: 2 }}>

                {Icon}
            </IconButton>
        </Tooltip>
    )
}

export default ButtonBody