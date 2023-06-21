import { GraphValue } from "../GraphProvider"
import { Expectation } from "./ExpectationsProvider"
import { Limit } from "./LimitsProvider"
import { Value } from "./ValuesProvider"

export interface EntryProps<Transaction extends TransactionType> {
    value: Transaction
    handleDelete: () => void
    handleSave: (newValue: Transaction) => void
}

export type GenericEntry<Transaction extends TransactionType> = ({ value, handleDelete, handleSave }: EntryProps<Transaction>) => JSX.Element
export type TransactionType = Expectation | Limit | Value

export interface GenericValuesContext<Transaction extends TransactionType> {
    values: Transaction[] | null
    graphValues: GraphValue[] | null
    addValue: () => void
    deleteValue: (expectation: Transaction, index: number) => void
    updateValue: (expectation: Transaction, index: number) => void
}

export class GenericValues<Transaction extends TransactionType> implements GenericValuesContext<Transaction>{
    values: Transaction[] | null
    graphValues: GraphValue[] | null
    addValue: () => void
    deleteValue: (expectation: Transaction, index: number) => void
    updateValue: (expectation: Transaction, index: number) => void

    constructor(
        values: Transaction[] | null,
        graphValues: GraphValue[] | null,
        addValue: () => void,
        deleteValue: (expectation: Transaction, index: number) => void,
        updateValue: (expectation: Transaction, index: number) => void) {

        this.values = values
        this.graphValues = graphValues
        this.addValue = addValue
        this.deleteValue = deleteValue
        this.updateValue = updateValue
    }
}