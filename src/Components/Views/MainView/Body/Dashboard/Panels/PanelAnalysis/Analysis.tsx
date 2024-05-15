import React, { useCallback, useMemo } from 'react'

import { ExpandMore } from '@mui/icons-material'
import { Box, Card, CardActionArea, CardContent, Chip, Collapse, Stack, Typography } from '@mui/material'
import { GraphExpectation } from 'Providers/GraphValuesProvider'
import AnalysisExpectation from './AnalysisExpectation'

type AggregatedExpectationRecord = Record<string, { label: string, amount: number, id: string }>

function aggregateExpectations(expectations: GraphExpectation[]): [number, AggregatedExpectationRecord] {
    return expectations.reduce<[number, AggregatedExpectationRecord]>(([result, resultPerExpectation], graphExpectation) => {
        let currentResult = 0

        graphExpectation.metadata.influences.forEach((expectation) => {
            currentResult += expectation.amount

            if (expectation.id) {
                if (!(expectation.id in resultPerExpectation)) {
                    resultPerExpectation[expectation.id] = { label: expectation.name, amount: 0, id: expectation.id }
                }
                resultPerExpectation[expectation.id].amount += expectation.amount
            }
        })

        return [result + currentResult, resultPerExpectation]
    }, [0, {}])
}

interface AnalysisProps {
    expectations: GraphExpectation[]
    label: string
}

const Analysis = ({ expectations, label }: AnalysisProps): JSX.Element => {
    const [expanded, setExpanded] = React.useState(false)
    const handleExpandClick = useCallback(() => {
        setExpanded(expanded => !expanded)
    }, [])

    const [result, aggregatedExpectations] = useMemo(() => {
        const [result, resultPerExpectation] = aggregateExpectations(expectations)
        const aggregatedExpectations = Object.values(resultPerExpectation).sort((a, b) => a.amount - b.amount)
        return [result, aggregatedExpectations]
    }, [expectations])

    return (
        <Card elevation={3}>
            <CardActionArea onClick={handleExpandClick}>
                <CardContent>
                    <Box sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', }}>
                        <Typography>{label}</Typography>

                        <Chip label={result} color={result < 0 ? 'error' : 'success'} variant="outlined" />

                        <ExpandMore sx={{ transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)', mr: 1 }} />
                    </Box>
                </CardContent>
            </CardActionArea>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Stack gap={1}>
                        {aggregatedExpectations.map(({ label, amount, id }) => {
                            return (
                                <AnalysisExpectation label={label} amount={amount} key={id} />
                            )
                        })}
                    </Stack>
                </CardContent>
            </Collapse>
        </Card>
    )
}


export default Analysis