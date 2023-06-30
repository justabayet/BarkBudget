import AddIcon from '@mui/icons-material/Add'
import { Box, Collapse, Fab, List, Typography } from '@mui/material'
import React from 'react'
import { TransitionGroup } from 'react-transition-group'
import { useDeviceDetails } from '../../Providers/DeviceDetailsProvider'
import { GenericEntry, GenericValuesContext, TransactionType } from '../../Providers/GraphValuesProvider/GenericValues'

interface TransactionListProps<Transaction extends TransactionType> {
    useValues: (() => GenericValuesContext<Transaction>)
    ChildComponent: GenericEntry<Transaction>
    textEmpty: string
}

type TransactionListType = <Transaction extends TransactionType>({ useValues, ChildComponent, textEmpty }: TransactionListProps<Transaction>) => JSX.Element

const TransactionList: TransactionListType = ({ useValues, ChildComponent, textEmpty }) => {
    const { values, addValue, deleteValue, updateValue } = useValues()
    const { isMobile, isBodyFullSize } = useDeviceDetails()

    const hasValues = values && values.length > 0

    return (
        <>
            {isBodyFullSize ?
                <Box sx={{ position: 'sticky', top: 377, left: '100%', width: 0, height: 0 }}>
                    <Fab sx={{ ml: '16px', mt: '-82px' }} color='info' aria-label='add' onClick={addValue}>
                        <AddIcon />
                    </Fab>
                </Box>
                :
                <Fab sx={{ position: 'fixed', bottom: isMobile ? 72 : 32, right: isMobile ? 16 : 32 }} color='info' aria-label='add' onClick={addValue}>
                    <AddIcon />
                </Fab>
            }

            {!hasValues &&
                <Typography sx={{ fontWeight: 400, opacity: 0.38, textAlign: 'center', mt: '150px' }}>
                    {textEmpty}
                </Typography>}

            {hasValues &&
                <List id='transaction-list'>
                    <TransitionGroup id='transition-group' component={null}>
                        {values?.map((value, index) => {
                            return (
                                <Collapse key={value.id} id={`collapse-${value.id}`} timeout={500}>
                                    <ChildComponent
                                        value={value}
                                        handleDelete={() => { deleteValue(value) }}
                                        handleSave={(updatedValue) => { updateValue(updatedValue) }} />
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