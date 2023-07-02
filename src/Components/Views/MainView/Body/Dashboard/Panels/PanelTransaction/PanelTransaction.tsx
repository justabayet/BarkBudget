import React from 'react'

import { GenericEntryType, GenericValuesContext, TransactionType } from 'Providers/GraphValuesProvider'

import FabAddTransaction from './FabAddTransaction'
import ListEmpty from './ListEmpty'
import ListTransaction from './ListTransaction'


interface PanelTransactionProps<Transaction extends TransactionType> {
    useValues: () => GenericValuesContext<Transaction>
    ChildComponent: GenericEntryType<Transaction>
    textEmpty: string
}

type PanelTransactionType = <Transaction extends TransactionType>({ useValues, ChildComponent, textEmpty }: PanelTransactionProps<Transaction>) => JSX.Element

const PanelTransaction: PanelTransactionType = ({ useValues, ChildComponent, textEmpty }) => {
    const { values, addValue, deleteValue, updateValue } = useValues()

    const hasValues = values && values.length > 0

    return (
        <>
            <FabAddTransaction addValue={addValue} />

            {!hasValues ?
                <ListEmpty textEmpty={textEmpty} />
                :
                <ListTransaction values={values} deleteValue={deleteValue} updateValue={updateValue} ChildComponent={ChildComponent} />
            }
        </>
    )
}


export default PanelTransaction