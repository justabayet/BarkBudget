import React from 'react'

import { Typography } from '@mui/material'


interface ListEmptyProps {
    textEmpty: string
}

const ListEmpty = ({ textEmpty }: ListEmptyProps): JSX.Element => {

    return (
        <Typography sx={{ fontWeight: 400, opacity: 0.38, textAlign: 'center', mt: '150px' }}>
            {textEmpty}
        </Typography>
    )
}


export default ListEmpty