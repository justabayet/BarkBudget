
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useScenario } from "./ScenarioProvider"

const currentDate = new Date()

class Expenses {
    constructor(expenses, addExpense, deleteExpense, updateExpense) {
        this.values = expenses
        this.addValue = addExpense
        this.deleteValue = deleteExpense
        this.updateValue = updateExpense
    }
}

class Expense {
    constructor({ date, amount, id }) {
        this.date = date
        this.amount = amount
        this.id = id
    }
}

const ExpensesContext = createContext(new Expenses([], () => { }, () => { }, () => { }))

const converter = {
    toFirestore(expense) {
        console.log(expense)
        return { date: getFormattedDate(expense.date), amount: expense.amount };
    },
    fromFirestore(snapshot, options) {
        const expenseDb = snapshot.data()
        const date = new Date(expenseDb.date)
        const amount = expenseDb.amount
        const id = snapshot.id
        return new Expense({ date, amount, id })
    }
}

export const ExpensesProvider = (props) => {
    const { scenarioDoc } = useScenario()

    const [expenses, setExpenses] = useState(null)
    const [expensesCollection, setExpensesCollection] = useState(null)

    const [newExpense, setNewExpense] = useState(new Expense({ date: currentDate, amount: 0 }))

    useEffect(() => {
        if (scenarioDoc) {
            setExpensesCollection(collection(scenarioDoc, 'expenses').withConverter(converter))
        } else {
            setExpensesCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (expensesCollection) {
            console.log("full read expenses")
            getDocs(expensesCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

                    const expensesQueried = []
                    querySnapshot.forEach(doc => {
                        expensesQueried.push(converter.fromFirestore(doc))
                    })

                    setExpenses(expensesQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setExpenses(null)
        }

    }, [expensesCollection])

    const addExpense = () => {
        console.log("add", newExpense)
        addDoc(expensesCollection, newExpense).then(document => {
            newExpense.id = document.id
        })
        setExpenses([newExpense, ...expenses])
        setNewExpense(new Expense({ date: currentDate, amount: 0 }))
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

        setDoc(doc(expensesCollection, expense.id), expense)
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