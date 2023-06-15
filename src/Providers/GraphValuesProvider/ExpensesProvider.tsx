import { CollectionReference, FirestoreDataConverter, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { ForecastEngine } from "../../Modes/ForecastEngine"
import { modeNames, modes } from "../../Modes/const"
import { getFormattedDate, getValidDate } from "../../helpers"
import { GraphValue, compareGraphValues } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"
import { GenericValues, GenericValuesContext } from "./GenericValues"
import { useValues } from "./ValuesProvider"

const currentDate = new Date()

export type ExpensesContextType = GenericValuesContext<Expense>

const Expenses = GenericValues<Expense>

interface ExpenseParameter {
    startDate?: Date
    endDate?: Date
    amount?: number
    mode?: string
    name: string
    id?: string
}

export class Expense {
    startDate: Date
    endDate: Date
    amount: number
    mode: string
    name: string
    id?: string

    constructor({ startDate, endDate, amount, id, mode, name }: ExpenseParameter) {
        this.id = id
        this.startDate = getValidDate(startDate)
        this.endDate = getValidDate(endDate)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.mode = mode && Object.values(modeNames).includes(mode) ? mode : modeNames.ONE_TIME
        this.name = name ? name : "New Expense"
    }
}

const ExpensesContext = createContext<ExpensesContextType>(new Expenses([], [], () => { }, () => { }, () => { }))

interface ExpenseFirestore {
    startDate: string,
    endDate: string,
    amount: string,
    mode: string,
    name: string
}

const converter: FirestoreDataConverter<Expense> = {
    toFirestore(expense: Expense): ExpenseFirestore {
        return {
            startDate: getFormattedDate(expense.startDate),
            endDate: getFormattedDate(expense.endDate),
            amount: expense.amount.toString(),
            mode: expense.mode,
            name: expense.name
        }
    },
    fromFirestore(snapshot: any, options?: any): Expense {
        const expenseDb: ExpenseFirestore = snapshot.data()
        const startDate = new Date(expenseDb.startDate)
        const endDate = new Date(expenseDb.endDate)
        const amount = parseInt(expenseDb.amount)
        const mode = expenseDb.mode
        const name = expenseDb.name
        const id = snapshot.id
        return new Expense({ startDate, endDate, amount, id, mode, name })
    }
}

const sortExpensesFunction = (expense1: Expense, expense2: Expense): number => {
    return expense1.startDate.getTime() - expense2.startDate.getTime()
}

export const ExpensesProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { scenario, scenarioDoc } = useScenario()

    let startDateScenario = scenario.startDate
    let endDate = scenario.endDate
    let startAmount = 0

    const { graphValues } = useValues()
    if (graphValues !== null && graphValues.length > 0) {
        const lastValue = graphValues[graphValues.length - 1]
        startDateScenario = lastValue.x
        startAmount = lastValue.y
    }

    const [expenses, setExpenses] = useState<Expense[] | null>(null)
    const [graphExpenses, setGraphExpenses] = useState<GraphValue[] | null>(null)
    const [expensesCollection, setExpensesCollection] = useState<CollectionReference | null>(null)

    const [newExpense, setNewExpense] = useState(new Expense({ startDate: currentDate, endDate: currentDate, amount: 0, mode: modeNames.ONE_TIME, name: "New Expense" }))

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

                    const expensesQueried: Expense[] = []
                    querySnapshot.forEach(doc => {
                        expensesQueried.push(converter.fromFirestore(doc))
                    })

                    expensesQueried.sort(sortExpensesFunction)
                    setExpenses(expensesQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setExpenses(null)
        }

    }, [expensesCollection])

    const addExpense = (): void => {
        console.log("add", newExpense)

        if (expensesCollection === null || expenses === null) {
            return
        }

        addDoc(expensesCollection, newExpense).then(document => {
            newExpense.id = document.id

            const newExpenses = [newExpense, ...expenses]
            newExpenses.sort(sortExpensesFunction)
            setExpenses(newExpenses)

            setNewExpense(new Expense({ startDate: currentDate, endDate: currentDate, amount: 0, mode: modeNames.ONE_TIME, name: "New Expense" }))
        })
    }

    const deleteExpense = (expense: Expense, index: number): void => {
        console.log("delete", expense)

        if (expensesCollection === null || expenses === null) {
            return
        }

        const updatedExpenses = [...expenses]
        updatedExpenses.splice(index, 1)
        setExpenses(updatedExpenses)

        deleteDoc(doc(expensesCollection, expense.id))
    }

    const updateExpense = (expense: Expense, index: number): void => {
        console.log("update", expense)

        if (expensesCollection === null || expenses === null) {
            return
        }

        const updatedExpenses = [...expenses]

        updatedExpenses[index] = expense
        updatedExpenses.sort(sortExpensesFunction)
        setExpenses(updatedExpenses)

        setDoc(doc(expensesCollection, expense.id), expense)
    }

    useEffect(() => {
        const getEngine = (startDateScenario: Date, endDate: Date, startAmount: number) => {
            const engine = new ForecastEngine(startDateScenario, endDate, startAmount)

            expenses?.forEach(expense => engine.addEntry(new modes[expense.mode](expense)))

            return engine
        }

        if (expenses === null) return
        console.log("ExpensesProvider compute graph expenses:", startDateScenario.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), startAmount, expenses?.length)
        const engine = getEngine(startDateScenario, endDate, startAmount)

        engine.iterate()
        const updatedGraphExpenses = engine.values?.map((computedValue): GraphValue => {
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
            {children}
        </ExpensesContext.Provider>
    )

}

export const useExpenses = (): ExpensesContextType => {
    return useContext(ExpensesContext)
}