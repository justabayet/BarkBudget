
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../../helpers"
import { ForecastEngine } from "../../Modes/ForecastEngine"
import { OneTime } from "../../Modes/OneTime"
import { compareGraphValues } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"
import { useValues } from "./ValuesProvider"

const currentDate = new Date()

class Expenses {
    constructor(expenses, graphExpenses, addExpense, deleteExpense, updateExpense) {
        this.values = expenses
        this.addValue = addExpense
        this.deleteValue = deleteExpense
        this.updateValue = updateExpense
        this.graphValues = graphExpenses
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
        const amount = parseInt(expenseDb.amount)
        const id = snapshot.id
        return new Expense({ date, amount, id })
    }
}

export const ExpensesProvider = (props) => {
    const { scenario, scenarioDoc } = useScenario()

    let startDate = scenario.startDate
    let endDate = scenario.endDate
    let startAmount = scenario.startAmount

    const { graphValues } = useValues()
    if (graphValues.length > 0) {
        const lastValue = graphValues[graphValues.length - 1]
        startDate = lastValue.x
        startAmount = lastValue.y
    }

    const [expenses, setExpenses] = useState([])
    const [graphExpenses, setGraphExpenses] = useState([])
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
            getDocs(expensesCollection)
                .then((querySnapshot) => {
                    console.log("ExpensesProvider Full read get", querySnapshot.size)

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


    const [engine, setEngine] = useState(new ForecastEngine(startDate, endDate, startAmount))

    useEffect(() => {
        setEngine(new ForecastEngine(startDate, endDate, startAmount))
    }, [startAmount, startDate, endDate])


    useEffect(() => {
        engine.cleanEntries()

        // Add expected expenses
        engine.addEntry(new OneTime({ date: new Date(startDate), amount: 15 }))
        const dMinus1 = new Date(endDate)
        dMinus1.setMonth(endDate.getMonth() - 1)
        engine.addEntry(new OneTime({ date: new Date(dMinus1), amount: 15 }))
        dMinus1.setMonth(endDate.getMonth() - 10)
        engine.addEntry(new OneTime({ date: new Date(dMinus1), amount: 15 }))

        engine.iterate()
        const updatedGraphExpenses = engine.values?.map(expense => {
            return {
                x: new Date(expense.date),
                y: expense.value,
            }
        })

        updatedGraphExpenses?.sort(compareGraphValues)
        setGraphExpenses(updatedGraphExpenses)
    }, [expenses, engine, startDate, endDate])


    return (
        <ExpensesContext.Provider
            value={(new Expenses(expenses, graphExpenses, addExpense, deleteExpense, updateExpense))}
        >
            {props.children}
        </ExpensesContext.Provider>
    )

}

export const useExpenses = () => {
    return useContext(ExpensesContext)
}