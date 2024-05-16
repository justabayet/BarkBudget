import React, { forwardRef } from 'react'

import { Divider, Typography } from '@mui/material'
import { TransactionType } from 'Providers/GraphValuesProvider'


interface DividerEntryProps {
    text: string
    id: string | undefined
}

const DividerEntry = forwardRef<HTMLHRElement, DividerEntryProps>(({ text, id }, ref) => (
    <Divider ref={ref} sx={{ mt: 1.5, mb: -1.5 }} id={id}><Typography variant='caption'>{text}</Typography></Divider>
))

interface DummyEntryProps {
    id: string | undefined
    ref: React.RefObject<HTMLHRElement>
}

export function isDummy(transaction: TransactionType) {
    return transaction.id != null &&
        ['startRecords', 'startScenario', 'endScenario'].includes(transaction.id)
}

const DummyEntry = forwardRef<HTMLHRElement, DummyEntryProps>(({ id }, ref) => {

    switch (id) {
        case 'startRecords':
            return <DividerEntry text={'Last Recorded Date'} id={id} ref={ref} />

        case 'startScenario':
            return <DividerEntry text={'Scenario Start Date'} id={id} ref={ref} />

        case 'endScenario':
            return <DividerEntry text={'Scenario End Date'} id={id} ref={ref} />

        default:
            return <></>
    }
})


export default DummyEntry
