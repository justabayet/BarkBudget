import { CollectionReference, FirestoreDataConverter, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate, getValidDate } from "../../helpers"
import { GraphValue, compareGraphValues } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"
import { GenericValues, GenericValuesContext } from "./GenericValues"

export type ValuesContextType = GenericValuesContext<Value>

const Values = GenericValues<Value>

interface ValueParameter {
    date?: Date
    amount?: number
    id?: string
}

export class Value {
    date: Date
    amount: number
    id?: string

    constructor({ date, amount, id }: ValueParameter) {
        this.date = getValidDate(date)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.id = id
    }
}

const ValuesContext = createContext<ValuesContextType>(new Values([], [], () => { }, () => { }, () => { }))

interface ValueFirestore {
    date: string,
    amount: string
}

const converter: FirestoreDataConverter<Value> = {
    toFirestore(value: Value): ValueFirestore {
        console.log(value)
        return { date: getFormattedDate(value.date), amount: value.amount.toString() };
    },
    fromFirestore(snapshot: any, options?: any): Value {
        const valueDb: ValueFirestore = snapshot.data()
        const date = new Date(valueDb.date)
        const amount = parseInt(valueDb.amount)
        const id = snapshot.id
        return new Value({ date, amount, id })
    }
}

const sortValuesFunction = (value1: Value, value2: Value): number => {
    return value2.date.getTime() - value1.date.getTime()
}

export const ValuesProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { scenarioDoc, scenario } = useScenario()
    const { startDate, endDate } = scenario

    const [values, setValues] = useState<Value[] | null>(null)
    const [graphValues, setGraphValues] = useState<GraphValue[] | null>([])
    const [valuesCollection, setValuesCollection] = useState<CollectionReference | null>(null)

    const [newValue, setNewValue] = useState(new Value({}))

    useEffect(() => {
        if (scenarioDoc) {
            setValuesCollection(collection(scenarioDoc, 'values').withConverter(converter))
        } else {
            setValuesCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (valuesCollection) {
            getDocs(valuesCollection)
                .then((querySnapshot) => {
                    console.log("ValuesProvider Full read get", querySnapshot.size)

                    const valuesQueried: Value[] = []

                    querySnapshot.forEach(doc => {
                        valuesQueried.push(converter.fromFirestore(doc))
                    })

                    valuesQueried.sort(sortValuesFunction)
                    setValues(valuesQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setValues(null)
        }

    }, [valuesCollection])

    const addValue = (): void => {
        console.log("add", newValue)

        if (valuesCollection === null || values === null) {
            return
        }

        addDoc(valuesCollection, newValue).then(document => {
            newValue.id = document.id

            const newValues = [newValue, ...values]
            newValues.sort(sortValuesFunction)
            setValues(newValues)

            setNewValue(new Value({}))
        })
    }

    const deleteValue = (value: Value, index: number): void => {
        console.log("delete", value)

        if (valuesCollection === null || values === null) {
            return
        }

        console.log("delete", value)
        const updatedValues = [...values]
        updatedValues.splice(index, 1)
        setValues(updatedValues)

        deleteDoc(doc(valuesCollection, value.id))
    }

    const updateValue = (value: Value, index: number): void => {
        console.log("update", value)

        if (valuesCollection === null || values === null) {
            return
        }

        const updatedValues = [...values]
        updatedValues[index] = value
        updatedValues.sort(sortValuesFunction)
        setValues(updatedValues)

        setDoc(doc(valuesCollection, value.id), value)
    }


    useEffect(() => {
        if (values === null) return

        console.log("ValuesProvider compute graph values:", startDate.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), values?.length)
        const updatedGraphValues = []

        updatedGraphValues.push({
            x: new Date(startDate),
            y: 0
        })

        values?.forEach(value => {
            if (value.date >= startDate && value.date <= endDate) {
                updatedGraphValues.push({
                    x: new Date(value.date),
                    y: value.amount,
                })
            }
        })

        updatedGraphValues.sort(compareGraphValues)
        setGraphValues(updatedGraphValues)
    }, [values, startDate, endDate])

    return (
        <ValuesContext.Provider value={(new Values(values, graphValues, addValue, deleteValue, updateValue))}>
            {children}
        </ValuesContext.Provider>
    )

}

export const useValues = (): ValuesContextType => {
    return useContext(ValuesContext)
}