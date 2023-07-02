import { colRef, dataType, delRef, docRef, objWithId } from "Providers/FirebaseRepositoryProvider"
import { CollectionReference, doc } from "firebase/firestore"
import { TransactionType } from "./TransactionTypes"


export function addTransaction<Transaction extends TransactionType>(
    newTransaction: Transaction,
    transactions: Transaction[] | null,
    transactionsCollection: CollectionReference<Transaction> | null,
    addDoc: (reference: colRef, data: dataType) => Promise<objWithId>,
    setTransactions: (value: React.SetStateAction<Transaction[] | null>) => void,
    setNewTransaction: () => void,
    sortFunction: (transaction1: Transaction, transaction2: Transaction) => number): void {

    console.log('add', newTransaction)

    if (transactionsCollection === null || transactions === null) {
        return
    }

    addDoc(transactionsCollection, newTransaction).then(document => {
        newTransaction.id = document.id
        newTransaction.new = true

        transactions.forEach(transaction => transaction.new = false)

        const newTransactions = [newTransaction, ...transactions]
        newTransactions.sort(sortFunction)
        setTransactions(newTransactions)

        setNewTransaction()
    })
}

export function getIndexTransaction<Transaction extends TransactionType>(
    id: string | undefined,
    transactions: Transaction[] | null): number {

    const index = transactions?.findIndex((transaction) => {
        return transaction.id === id
    })

    return index ? index : 0
}

export function deleteTransaction<Transaction extends TransactionType>(
    transaction: Transaction,
    transactions: Transaction[] | null,
    transactionsCollection: CollectionReference<Transaction> | null,
    setTransactions: (value: React.SetStateAction<Transaction[] | null>) => void,
    deleteDoc: (reference: delRef) => Promise<void>): void {

    console.log('delete', transaction)

    if (transactionsCollection === null || transactions === null) {
        return
    }

    const index: number = getIndexTransaction<Transaction>(transaction.id, transactions)

    const updatedTransactions = [...transactions]
    updatedTransactions.splice(index, 1)
    setTransactions(updatedTransactions)

    deleteDoc(doc(transactionsCollection, transaction.id))
}

export function updateTransaction<Transaction extends TransactionType>(
    transaction: Transaction,
    transactions: Transaction[] | null,
    transactionsCollection: CollectionReference<Transaction> | null,
    sortFunction: (transaction1: Transaction, transaction2: Transaction) => number,
    setTransactions: (value: React.SetStateAction<Transaction[] | null>) => void,
    setDoc: (reference: docRef, data: dataType) => Promise<void>): void {

    console.log('update', transaction)

    if (transactionsCollection === null || transactions === null) {
        return
    }

    const index: number = getIndexTransaction<Transaction>(transaction.id, transactions)
    transaction.edited = true
    transactions.forEach(transac => transac.edited = false)

    const updatedTransactions = [...transactions]
    updatedTransactions[index] = transaction

    updatedTransactions.sort(sortFunction)
    setTransactions(updatedTransactions)

    setDoc(doc(transactionsCollection, transaction.id), transaction)
}