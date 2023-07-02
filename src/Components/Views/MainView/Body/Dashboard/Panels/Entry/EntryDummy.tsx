import React from 'react'

import { Divider, Typography } from '@mui/material'


interface DummyEntryProps {
    id: string | undefined
}

interface DividerEntryProps {
    text: string
}

const DummyEntry = ({ id }: DummyEntryProps) => {
    const DividerEntry = ({ text }: DividerEntryProps) => (
        <Divider sx={{ mt: 1.5, mb: -1.5 }} id={id}><Typography variant='caption'>{text}</Typography></Divider>
    )

    switch (id) {
        case 'startRecords':
            return <DividerEntry text={'Last Recorded Date'} />

        case 'startScenario':
            return <DividerEntry text={'Scenario Start Date'} />

        case 'endScenario':
            return <DividerEntry text={'Scenario End Date'} />

        default:
            break
    }
}


export default DummyEntry
