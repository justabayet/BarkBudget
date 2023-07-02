import AddIcon from '@mui/icons-material/Add'
import { Box, Button } from '@mui/material'
import { useScenarios } from 'Providers/ScenariosProvider'
import React from 'react'

const ScenariosEmpty = (): JSX.Element => {
    const { addScenario } = useScenarios()

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }} gap={2}>
            <Button color="primary" onClick={addScenario}>
                Create your first scenario to get started
            </Button>

            <Button
                onClick={addScenario}
                sx={{ borderRadius: '50%', p: 1.5, minWidth: 0, width: 'fit-content' }}
                variant='outlined'
                color='success'>
                <AddIcon />
            </Button >
        </Box>
    )
}

export default ScenariosEmpty