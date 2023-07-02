import { GraphValue } from "Providers/GraphProvider"
import { Expectation } from "Providers/GraphValuesProvider/ExpectationsProvider"
import { Limit } from "Providers/GraphValuesProvider/LimitsProvider"
import { Record } from "Providers/GraphValuesProvider/RecordsProvider"

export interface EntryProps<Transaction extends TransactionType> {
    value: Transaction
    handleDelete: () => void
    handleSave: (newValue: Transaction) => void
}

export type GenericEntryType<Transaction extends TransactionType> = ({ value, handleDelete, handleSave }: EntryProps<Transaction>) => JSX.Element
export type TransactionType = Expectation | Limit | Record

export interface GenericValuesContext<Transaction extends TransactionType> {
    values: Transaction[] | null
    graphValues: GraphValue[] | null
    addValue: () => void
    deleteValue: (transaction: Transaction) => void
    updateValue: (newTransaction: Transaction) => void
    isLoading: boolean
}

export class GenericValues<Transaction extends TransactionType> implements GenericValuesContext<Transaction>{
    values: Transaction[] | null
    graphValues: GraphValue[] | null
    addValue: () => void
    deleteValue: (transaction: Transaction) => void
    updateValue: (newTransaction: Transaction) => void
    isLoading: boolean

    constructor(
        values: Transaction[] | null,
        graphValues: GraphValue[] | null,
        addValue: () => void,
        deleteValue: (transaction: Transaction) => void,
        updateValue: (newTransaction: Transaction) => void,
        isLoading: boolean) {

        this.values = values
        this.graphValues = graphValues
        this.addValue = addValue
        this.deleteValue = deleteValue
        this.updateValue = updateValue
        this.isLoading = isLoading
    }
}