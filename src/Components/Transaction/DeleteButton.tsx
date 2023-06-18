import DeleteIcon from '@mui/icons-material/Delete'
import { Button, ButtonProps } from "@mui/material"
import React from "react"


interface DeleteButtonProps extends ButtonProps {
    action: () => void
}

const DeleteButton = ({ action, sx }: DeleteButtonProps): JSX.Element => {
    return (
        <Button
            onClick={action}
            sx={{ borderRadius: '50%', p: 1.5, minWidth: 0, ...sx }}
            variant='outlined'
            color='error'>
            <DeleteIcon />
        </Button>
    )
}

export default DeleteButton

