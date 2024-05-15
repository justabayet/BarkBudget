import React, { useMemo } from 'react'

import { Stack } from '@mui/material'
import { GraphExpectation } from 'Providers/GraphValuesProvider'
import Analysis from './Analysis'
import { Step } from './PanelAnalysis'

interface ExpectationGroup {
    [label: string]: GraphExpectation[]
}

interface AnalysisListProps {
    expectations: GraphExpectation[]
    stepping: Step
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getLabelForStepping(date: Date, stepping: Step): string {
    switch (stepping) {
        case 'All':
            return `All`
        case 'Monthly':
            return `${months[date.getMonth()]} ${date.getFullYear()}`
        case 'Yearly':
            return date.getFullYear().toString()
    }
}

const AnalysisList = ({ expectations, stepping }: AnalysisListProps): JSX.Element => {
    const expectationGroups: ExpectationGroup = useMemo(() => {
        const group: ExpectationGroup = {}
        expectations.forEach((expectation) => {
            const label = getLabelForStepping(expectation.x, stepping)

            if (!(label in group)) {
                group[label] = []
            }

            group[label].push(expectation)
        })
        return group
    }, [expectations, stepping])

    return (
        <Stack spacing={3}>
            {Object.entries(expectationGroups)
                .map(([label, analysisExpectations]) =>
                    <Analysis expectations={analysisExpectations} label={label} key={label} />)
            }
        </Stack>
    )
}

export default AnalysisList