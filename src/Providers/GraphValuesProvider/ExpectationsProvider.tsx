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

export type ExpectationsContextType = GenericValuesContext<Expectation>

const Expectations = GenericValues<Expectation>

interface ExpectationParameter {
    startDate?: Date
    endDate?: Date
    amount?: number
    mode?: string
    name: string
    id?: string
    new?: boolean
}

export class Expectation {
    startDate: Date
    endDate: Date
    amount: number
    mode: string
    name: string
    id?: string
    new?: boolean

    constructor({ startDate, endDate, amount, id, mode, name }: ExpectationParameter) {
        this.id = id
        this.startDate = getValidDate(startDate)
        this.endDate = getValidDate(endDate)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.mode = mode && Object.values(modeNames).includes(mode) ? mode : modeNames.ONE_TIME
        this.name = name ? name : "New Expectation"
    }
}

const ExpectationsContext = createContext<ExpectationsContextType>(new Expectations([], [], () => { }, () => { }, () => { }))

interface ExpectationFirestore {
    startDate: string,
    endDate: string,
    amount: string,
    mode: string,
    name: string
}

const converter: FirestoreDataConverter<Expectation> = {
    toFirestore(expectation: Expectation): ExpectationFirestore {
        return {
            startDate: getFormattedDate(expectation.startDate),
            endDate: getFormattedDate(expectation.endDate),
            amount: expectation.amount.toString(),
            mode: expectation.mode,
            name: expectation.name
        }
    },
    fromFirestore(snapshot: any, options?: any): Expectation {
        const expectationDb: ExpectationFirestore = snapshot.data()
        const startDate = new Date(expectationDb.startDate)
        const endDate = new Date(expectationDb.endDate)
        const amount = parseInt(expectationDb.amount)
        const mode = expectationDb.mode
        const name = expectationDb.name
        const id = snapshot.id
        return new Expectation({ startDate, endDate, amount, id, mode, name })
    }
}

const sortExpectationsFunction = (expectation1: Expectation, expectation2: Expectation): number => {
    const getTime = (expectation: Expectation): number => {
        if ([modeNames.DAILY, modeNames.MONTHLY].includes(expectation.mode)) {
            return expectation.endDate.getTime()
        } else {
            return expectation.startDate.getTime()
        }
    }

    return getTime(expectation1) - getTime(expectation2)
}

export const ExpectationsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
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

    const [expectations, setExpectations] = useState<Expectation[] | null>(null)
    const [graphExpectations, setGraphExpectations] = useState<GraphValue[] | null>(null)
    const [expectationsCollection, setExpectationsCollection] = useState<CollectionReference | null>(null)

    const [newExpectation, setNewExpectation] = useState(new Expectation({ startDate: scenario.startDate, endDate: scenario.startDate, amount: 0, mode: modeNames.ONE_TIME, name: "New Expectation" }))

    useEffect(() => {
        if (scenarioDoc) {
            setExpectationsCollection(collection(scenarioDoc, 'expenses').withConverter(converter))
        } else {
            setExpectationsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (expectationsCollection) {
            getDocs(expectationsCollection)
                .then((querySnapshot) => {
                    console.log("ExpectationsProvider Full read get", querySnapshot.size)

                    const expectationsQueried: Expectation[] = []
                    querySnapshot.forEach(doc => {
                        expectationsQueried.push(converter.fromFirestore(doc))
                    })

                    expectationsQueried.sort(sortExpectationsFunction)
                    setExpectations(expectationsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setExpectations(null)
        }

    }, [expectationsCollection])

    const addExpectation = (): void => {
        console.log("add", newExpectation)

        if (expectationsCollection === null || expectations === null) {
            return
        }

        addDoc(expectationsCollection, newExpectation).then(fbDocument => {
            newExpectation.id = fbDocument.id
            newExpectation.new = true

            expectations.forEach(expectation => expectation.new = false)

            const newExpectations = [newExpectation, ...expectations]
            newExpectations.sort(sortExpectationsFunction)
            setExpectations(newExpectations)

            let element = document.getElementById("startScenario")
            window.scrollTo({ behavior: "smooth", top: element?.offsetTop })

            setNewExpectation(new Expectation({ startDate: scenario.startDate, endDate: scenario.startDate, amount: 0, mode: modeNames.ONE_TIME, name: "New Expectation" }))
        })
    }

    const getIndex = (id: string | undefined): number => {
        const index = expectations?.findIndex((expectation) => {
            return expectation.id === id
        })

        return index ? index : 0
    }

    const deleteExpectation = (expectation: Expectation): void => {
        console.log("delete", expectation)

        if (expectationsCollection === null || expectations === null) {
            return
        }

        const index: number = getIndex(expectation.id)

        const updatedExpectations = [...expectations]
        updatedExpectations.splice(index, 1)
        setExpectations(updatedExpectations)

        deleteDoc(doc(expectationsCollection, expectation.id))
    }

    const updateExpectation = (expectation: Expectation): void => {
        console.log("update", expectation)

        if (expectationsCollection === null || expectations === null) {
            return
        }

        const index: number = getIndex(expectation.id)

        const updatedExpectations = [...expectations]

        updatedExpectations[index] = expectation
        updatedExpectations.sort(sortExpectationsFunction)
        setExpectations(updatedExpectations)

        setDoc(doc(expectationsCollection, expectation.id), expectation)
    }

    useEffect(() => {
        const getEngine = (startDateRecords: Date, endDate: Date, startAmount: number) => {
            const engine = new ForecastEngine(startDateRecords, endDate, startAmount)

            expectations?.forEach(expectation => engine.addEntry(new modes[expectation.mode](expectation)))

            return engine
        }

        if (expectations === null) return
        console.log("ExpectationsProvider compute graph expectations:", startDateRecords.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), startAmount, expectations?.length)
        const engine = getEngine(startDateRecords, endDate, startAmount)

        engine.iterate()
        const updatedGraphExpectations = engine.values?.map((computedValue): GraphValue => {
            return {
                x: new Date(computedValue.date),
                y: computedValue.value,
            }
        })

        updatedGraphExpectations?.sort(compareGraphValues)
        setGraphExpectations(updatedGraphExpectations)
    }, [expectations, startDateRecords, endDate, startAmount])

    const dummyStartRecords = new Expectation({ startDate: startDateRecords, endDate: startDateRecords, amount: startAmount, id: "startRecords", name: "startRecords" })
    const dummyStartScenario = new Expectation({ startDate: scenario.startDate, endDate: scenario.startDate, amount: startAmount, id: "startScenario", name: "startScenario" })
    const dummyEndScenario = new Expectation({ startDate: scenario.endDate, endDate: scenario.endDate, amount: startAmount, id: "endScenario", name: "endScenario", mode: modeNames.MONTHLY })

    let expectationsWithDummy: Expectation[] = []

    if (expectations && expectations.length > 0) {
        if (startDateRecords > scenario.startDate && expectations.find((expectation) => sortExpectationsFunction(expectation, dummyStartScenario) > 0 && sortExpectationsFunction(expectation, dummyStartRecords) < 0)) expectationsWithDummy.push(dummyStartRecords)
        if (expectations.find((expectation) => sortExpectationsFunction(expectation, dummyStartScenario) < 0)) expectationsWithDummy.push(dummyStartScenario)
        if (expectations.find((expectation) => sortExpectationsFunction(expectation, dummyEndScenario) > 0)) expectationsWithDummy.push(dummyEndScenario)

        expectationsWithDummy = expectationsWithDummy.concat(expectations).sort(sortExpectationsFunction)
    }

    return (
        <ExpectationsContext.Provider
            value={(new Expectations(expectationsWithDummy, graphExpectations, addExpectation, deleteExpectation, updateExpectation))}
        >
            {children}
        </ExpectationsContext.Provider>
    )

}

export const useExpectations = (): ExpectationsContextType => {
    return useContext(ExpectationsContext)
}