
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../../helpers"
import { ForecastEngine } from "../../Modes/ForecastEngine"
import { OneTime } from "../../Modes/OneTime"
import { compareGraphValues } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"
import { useValues } from "./ValuesProvider"
import { modeNames } from "../../Modes/const"

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
    constructor({ startDate, endDate, amount, id, mode }) {
        this.startDate = startDate
        this.endDate = endDate
        this.amount = amount
        this.mode = mode
        this.id = id

        if (this.startDate === undefined || isNaN(this.startDate)) {
            this.startDate = new Date()
        }

        if (this.endDate === undefined || isNaN(this.endDate)) {
            this.endDate = new Date()
        }

        if (isNaN(this.amount)) {
            this.amount = 0
        }

        if (!Object.keys(modeNames).includes(this.mode)) {
            this.mode = modeNames.ONE_TIME
        }
    }
}

const ExpensesContext = createContext(new Expenses([], () => { }, () => { }, () => { }))

const converter = {
    toFirestore(expense) {
        return {
            startDate: getFormattedDate(expense.startDate),
            endDate: getFormattedDate(expense.endDate),
            amount: expense.amount,
            mode: expense.mode
        };
    },
    fromFirestore(snapshot, options) {
        const expenseDb = snapshot.data()
        const startDate = new Date(expenseDb.startDate)
        const endDate = new Date(expenseDb.endDate)
        const amount = parseInt(expenseDb.amount)
        const mode = expenseDb.mode
        const id = snapshot.id
        return new Expense({ startDate, endDate, amount, id, mode })
    }
}

export const ExpensesProvider = (props) => {
    const { scenario, scenarioDoc } = useScenario()

    let startDateScenario = scenario.startDate
    let endDate = scenario.endDate
    let startAmount = scenario.startAmount

    const { graphValues } = useValues()
    if (graphValues.length > 0) {
        const lastValue = graphValues[graphValues.length - 1]
        startDateScenario = lastValue.x
        startAmount = lastValue.y
    }

    const [expenses, setExpenses] = useState(null)
    const [graphExpenses, setGraphExpenses] = useState(null)
    const [expensesCollection, setExpensesCollection] = useState(null)

    const [newExpense, setNewExpense] = useState(new Expense({ startDate: currentDate, endDate: currentDate, amount: 0, mode: modeNames.ONE_TIME }))

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
        setNewExpense(new Expense({ startDate: currentDate, endDate: currentDate, amount: 0, mode: modeNames.ONE_TIME }))
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

    useEffect(() => {
        const getEngine = (startDateScenario, endDate, startAmount) => {
            const engine = new ForecastEngine(startDateScenario, endDate, startAmount)

            expenses.forEach(expense => {
                switch (expense.mode) {
                    case modeNames.ONE_TIME:
                        engine.addEntry(new OneTime({ date: new Date(expense.startDate), amount: expense.amount }))
                        break;

                    default:
                        break;
                }
            })

            return engine
        }

        if (expenses === null) return
        console.log("ExpensesProvider compute graph expenses:", startDateScenario.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), startAmount, expenses?.length)
        const engine = getEngine(startDateScenario, endDate, startAmount)

        engine.iterate()
        const updatedGraphExpenses = engine.values?.map(computedValue => {
            return {
                x: new Date(computedValue.date),
                y: computedValue.value,
            }
        })

        updatedGraphExpenses?.sort(compareGraphValues)
        setGraphExpenses(updatedGraphExpenses)
    }, [expenses, startDateScenario, endDate, startAmount])


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