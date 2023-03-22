
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useDatabase } from "./DatabaseProvider"
import { getFormattedDate } from "../helpers"

const currentDate = getFormattedDate(new Date())

class Expenses {
    constructor(expenses, addExpense, deleteExpense, updateExpense) {
        this.values = expenses
        this.addValue = addExpense
        this.deleteValue = deleteExpense
        this.updateValue = updateExpense
    }
}

const ExpensesContext = createContext(new Expenses([], () => {}, () => {}, () => {}))

export const ExpensesProvider = (props) => {
    const { database } = useDatabase()

    const [expenses, setExpenses] = useState(null)
    const [expensesCollection, setExpensesCollection] = useState(null)

    const [newValue, setNewValue] = useState({ date: currentDate, amount: 0 })

    useEffect(() => {
        if(database) {
            setExpensesCollection(collection(database, 'expenses'))
        } else {
            setExpensesCollection(null)
        }

    }, [database])

    useEffect(() => {
        if (expensesCollection) {
            console.log("full read expenses")
            getDocs(expensesCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

                    const expensesQueried = []

                    querySnapshot.forEach(doc => {
                        const data = doc.data()
                        data.id = doc.id

                        expensesQueried.push(data)
                    })

                    setExpenses(expensesQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setExpenses(null)
        }

    }, [expensesCollection])

    const addExpense = () => {
        console.log("add", newValue)
        addDoc(expensesCollection, newValue).then(document => {
            newValue.id = document.id
        })
        setExpenses([newValue, ...expenses])
        setNewValue({ date: currentDate, amount: 0 })
    }

    const deleteExpense = (expense, index) => {
        console.log("delete", expense)
        const updatedExpenses = [...expenses]
        updatedExpenses.splice(index, 1)
        setExpenses(updatedExpenses)

        deleteDoc(doc(expensesCollection, expense.id))
    }

    const updateExpense = (expense, index) => {
        console.log("update", expense)
        const updatedExpenses = [...expenses]
        updatedExpenses[index] = expense
        setExpenses(updatedExpenses)

        const { id, ...newExpense } = expense

        setDoc(doc(expensesCollection, id), newExpense)
    }

    return (
        <ExpensesContext.Provider
            value={(new Expenses(expenses, addExpense, deleteExpense, updateExpense))}
        >
            {props.children}
        </ExpensesContext.Provider>
    )

}

export const useExpenses = () => {
    return useContext(ExpensesContext)
}