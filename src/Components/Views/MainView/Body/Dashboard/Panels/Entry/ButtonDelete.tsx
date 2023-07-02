import React from 'react'

import { Delete } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'


const ButtonDelete = ({ onClick, sx }: ButtonProps): JSX.Element => {
    return (
        <Button
            onClick={onClick}
            sx={{ borderRadius: '50%', p: 1, minWidth: 0, ...sx }}
            variant='outlined'
            color='error'>
            <Delete />
        </Button>
    )
}


export default ButtonDelete

