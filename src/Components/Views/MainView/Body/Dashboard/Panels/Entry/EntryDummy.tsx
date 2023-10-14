import React from 'react'

import { Divider, Typography } from '@mui/material'


interface DividerEntryProps {
    text: string
    id: string | undefined
}

const DividerEntry = ({ text, id }: DividerEntryProps) => (
    <Divider sx={{ mt: 1.5, mb: -1.5 }} id={id}><Typography variant='caption'>{text}</Typography></Divider>
)

interface DummyEntryProps {
    id: string | undefined
}

const DummyEntry = ({ id }: DummyEntryProps) => {

    switch (id) {
        case 'startRecords':
            return <DividerEntry text={'Last Recorded Date'} id={id} />

        case 'startScenario':
            return <DividerEntry text={'Scenario Start Date'} id={id} />

        case 'endScenario':
            return <DividerEntry text={'Scenario End Date'} id={id} />

        default:
            break
    }
}


export default DummyEntry
