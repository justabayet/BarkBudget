import { CollectionReference, FirestoreDataConverter, collection, doc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { ForecastEngine } from "../../Modes/ForecastEngine"
import { modeNames, modes } from "../../Modes/const"
import { getFormattedDate, getValidDate } from "../../helpers"
import { useFirebaseRepository } from "../FirebaseRepositoryProvider"
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
        this.name = name ? name : "New Expectation"
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
    const getTime = (expense: Expense): number => {
        if ([modeNames.DAILY, modeNames.MONTHLY].includes(expense.mode)) {
            return expense.endDate.getTime()
        } else {
            return expense.startDate.getTime()
        }
    }

    return getTime(expense1) - getTime(expense2)
}

export const ExpensesProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { scenario, scenarioDoc } = useScenario()
    const { addDoc, deleteDoc, setDoc } = useFirebaseRepository()

    let startDateRecords = scenario.startDate
    let endDate = scenario.endDate
    let startAmount = 0

    const { graphValues } = useValues()
    if (graphValues !== null && graphValues.length > 0) {
        const lastValue = graphValues[graphValues.length - 1]
        startDateRecords = lastValue.x
        startAmount = lastValue.y
    }

    const [expenses, setExpenses] = useState<Expense[] | null>(null)
    const [graphExpenses, setGraphExpenses] = useState<GraphValue[] | null>(null)
    const [expensesCollection, setExpensesCollection] = useState<CollectionReference | null>(null)

    const [newExpense, setNewExpense] = useState(new Expense({ startDate: currentDate, endDate: currentDate, amount: 0, mode: modeNames.ONE_TIME, name: "New Expectation" }))

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

            setNewExpense(new Expense({ startDate: currentDate, endDate: currentDate, amount: 0, mode: modeNames.ONE_TIME, name: "New Expectation" }))
        })
    }

    const getIndex = (id: string | undefined): number => {
        const index = expenses?.findIndex((expense) => {
            return expense.id === id
        })

        return index ? index : 0
    }

    const deleteExpense = (expense: Expense): void => {
        console.log("delete", expense)

        if (expensesCollection === null || expenses === null) {
            return
        }

        const index: number = getIndex(expense.id)

        const updatedExpenses = [...expenses]
        updatedExpenses.splice(index, 1)
        setExpenses(updatedExpenses)

        deleteDoc(doc(expensesCollection, expense.id))
    }

    const updateExpense = (expense: Expense): void => {
        console.log("update", expense)

        if (expensesCollection === null || expenses === null) {
            return
        }

        const index: number = getIndex(expense.id)

        const updatedExpenses = [...expenses]

        updatedExpenses[index] = expense
        updatedExpenses.sort(sortExpensesFunction)
        setExpenses(updatedExpenses)

        setDoc(doc(expensesCollection, expense.id), expense)
    }

    useEffect(() => {
        const getEngine = (startDateRecords: Date, endDate: Date, startAmount: number) => {
            const engine = new ForecastEngine(startDateRecords, endDate, startAmount)

            expenses?.forEach(expense => engine.addEntry(new modes[expense.mode](expense)))

            return engine
        }

        if (expenses === null) return
        console.log("ExpensesProvider compute graph expenses:", startDateRecords.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), startAmount, expenses?.length)
        const engine = getEngine(startDateRecords, endDate, startAmount)

        engine.iterate()
        const updatedGraphExpenses = engine.values?.map((computedValue): GraphValue => {
            return {
                x: new Date(computedValue.date),
                y: computedValue.value,
            }
        })

        updatedGraphExpenses?.sort(compareGraphValues)
        setGraphExpenses(updatedGraphExpenses)
    }, [expenses, startDateRecords, endDate, startAmount])

    const dummyStartRecords = new Expense({ startDate: startDateRecords, endDate: startDateRecords, amount: startAmount, id: "startRecords", name: "startRecords" })
    const dummyStartScenario = new Expense({ startDate: scenario.startDate, endDate: scenario.startDate, amount: startAmount, id: "startScenario", name: "startScenario" })
    const dummyEndScenario = new Expense({ startDate: scenario.endDate, endDate: scenario.endDate, amount: startAmount, id: "endScenario", name: "endScenario", mode: modeNames.MONTHLY })

    let expensesWithDummy: Expense[] = []

    if (expenses && expenses.length > 0) {
        if (startDateRecords > scenario.startDate && expenses.find((expense) => sortExpensesFunction(expense, dummyStartScenario) > 0 && sortExpensesFunction(expense, dummyStartRecords) < 0)) expensesWithDummy.push(dummyStartRecords)
        if (expenses.find((expense) => sortExpensesFunction(expense, dummyStartScenario) < 0)) expensesWithDummy.push(dummyStartScenario)
        if (expenses.find((expense) => sortExpensesFunction(expense, dummyEndScenario) > 0)) expensesWithDummy.push(dummyEndScenario)

        expensesWithDummy = expensesWithDummy.concat(expenses).sort(sortExpensesFunction)
    }

    return (
        <ExpensesContext.Provider
            value={(new Expenses(expensesWithDummy, graphExpenses, addExpense, deleteExpense, updateExpense))}
        >
            {children}
        </ExpensesContext.Provider>
    )

}

export const useExpenses = (): ExpensesContextType => {
    return useContext(ExpensesContext)
}