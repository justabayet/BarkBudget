import { GraphValue } from "../GraphProvider"
import { Expense } from "./ExpensesProvider"
import { Limit } from "./LimitsProvider"
import { Value } from "./ValuesProvider"

export interface EntryProps<Transaction extends TransactionType> {
    value: Transaction
    handleDelete: () => void
    handleSave: (newValue: Transaction) => void
}

export type GenericEntry<Transaction extends TransactionType> = ({ value, handleDelete, handleSave }: EntryProps<Transaction>) => JSX.Element
export type TransactionType = Expense | Limit | Value

export interface GenericValuesContext<Transaction extends TransactionType> {
    values: Transaction[] | null
    graphValues: GraphValue[] | null
    addValue: () => void
    deleteValue: (expense: Transaction, index: number) => void
    updateValue: (expense: Transaction, index: number) => void
}

export class GenericValues<Transaction extends TransactionType> implements GenericValuesContext<Transaction>{
    values: Transaction[] | null
    graphValues: GraphValue[] | null
    addValue: () => void
    deleteValue: (expense: Transaction, index: number) => void
    updateValue: (expense: Transaction, index: number) => void

    constructor(
        values: Transaction[] | null,
        graphValues: GraphValue[] | null,
        addValue: () => void,
        deleteValue: (expense: Transaction, index: number) => void,
        updateValue: (expense: Transaction, index: number) => void) {

        this.values = values
        this.graphValues = graphValues
        this.addValue = addValue
        this.deleteValue = deleteValue
        this.updateValue = updateValue
    }
}