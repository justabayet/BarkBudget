import React, { useState } from 'react'

import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

import { GraphExpectation, useExpectations } from 'Providers/GraphValuesProvider'
import AnalysisList from './AnalysisList'


export type Step = 'Monthly' | 'Yearly' | 'All'

const PanelAnalysis = () => {
    const data = useExpectations()
    const graphValues = data.graphValues as GraphExpectation[]

    const [stepping, setStepping] = useState<Step>('Monthly')

    if (data.graphValues == null) {
        return <Typography>Error while getting data</Typography>

    } else if (data.values?.length === 0) {
        return (
            <Typography sx={{ fontWeight: 400, opacity: 0.38, textAlign: 'center', mt: '150px' }}>
                Add expected expecations in the other tab to start having analytics
            </Typography>
        )
    } else {
        return (
            <Stack marginTop={2} spacing={2} id='stack-panel-analysis' key='stack-panel-analysis'>
                <ToggleButtonGroup
                    size="small"
                    value={stepping}
                    exclusive
                    onChange={(_, value) => setStepping(value)}
                    aria-label="analytics steping">

                    <ToggleButton value="Monthly" aria-label="monthly">
                        <Typography sx={{ pl: 0.5, pr: 0.5 }}>M</Typography>
                    </ToggleButton>
                    <ToggleButton value="Yearly" aria-label="yearly">
                        <Typography sx={{ pl: 0.5, pr: 0.5 }}>Y</Typography>
                    </ToggleButton>
                    <ToggleButton value="All" aria-label="All">
                        <Typography sx={{ pl: 1.2, pr: 1.2 }}>{ }</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>

                <AnalysisList expectations={graphValues} stepping={stepping} />
            </Stack>
        )
    }
}


export default PanelAnalysis
