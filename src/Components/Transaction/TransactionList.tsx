import AddIcon from '@mui/icons-material/Add'
import { Box, Collapse, Fab, List, Typography } from '@mui/material'
import React from 'react'
import { TransitionGroup } from 'react-transition-group'
import { useDeviceDetails } from '../../Providers/DeviceDetailsProvider'
import { GenericEntry, GenericValuesContext, TransactionType } from '../../Providers/GraphValuesProvider/GenericValues'

interface TransactionListProps<Transaction extends TransactionType> {
    useValues: (() => GenericValuesContext<Transaction>)
    ChildComponent: GenericEntry<Transaction>
}

type TransactionListType = <Transaction extends TransactionType>({ useValues, ChildComponent }: TransactionListProps<Transaction>) => JSX.Element

const TransactionList: TransactionListType = ({ useValues, ChildComponent }) => {
    const { values, addValue, deleteValue, updateValue } = useValues()
    const { isMobile } = useDeviceDetails()

    const hasValues = values && values.length > 0

    let fabPlacement = {
        bottom: 72,
        right: 16,
    }
    if (!isMobile) {
        fabPlacement.bottom = 32
        fabPlacement.right = 32
    }

    return (
        <>
            <Fab sx={{
                position: 'fixed',
                ...fabPlacement
            }} color='info' aria-label='add' onClick={addValue}>
                <AddIcon />
            </Fab>
            {!hasValues &&
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '300px' }}>
                    <Typography sx={{ color: '#333333', fontWeight: 400, opacity: 0.38, textAlign: 'center' }}>
                        Press the + button to add an element
                    </Typography>
                </Box>}

            {hasValues &&
                <List id='transaction-list'>
                    <TransitionGroup id='transition-group' component={null}>
                        {values?.map((value, index) => {
                            return (
                                <Collapse key={value.id} id={`collapse-${value.id}`}>
                                    <ChildComponent
                                        value={value}
                                        handleDelete={() => { deleteValue(value, index) }}
                                        handleSave={(updatedValue) => { updateValue(updatedValue, index) }} />
                                </Collapse>
                            )
                        })}
                    </TransitionGroup>
                </List>
            }
        </>
    )
}

export default TransactionList