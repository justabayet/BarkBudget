import React from 'react'

import { Collapse, List } from '@mui/material'

import { GenericEntryType, TransactionType } from 'Providers/GraphValuesProvider'
import { TransitionGroup } from 'react-transition-group'


interface ListTransactionProps<Transaction extends TransactionType> {
    deleteValue: (transaction: Transaction) => void
    updateValue: (newTransaction: Transaction) => void
    values: Transaction[]
    ChildComponent: GenericEntryType<Transaction>
}
type ListTransactionType = <Transaction extends TransactionType>({ values, deleteValue, updateValue, ChildComponent }: ListTransactionProps<Transaction>) => JSX.Element


const ListTransaction: ListTransactionType = ({ values, deleteValue, updateValue, ChildComponent }) => {

    return (
        <List id='transaction-list'>
            <TransitionGroup id='transition-group' component={null}>
                {values?.map((value, _) => {
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
    )
}


export default ListTransaction