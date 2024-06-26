import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { CollectionReference, FirestoreDataConverter, collection, getDocs } from 'firebase/firestore'

import { ForecastEngine, modeNames, modes } from 'Modes'
import { getFormattedDate, getValidDate } from 'helpers'

import { useFirebaseRepository } from 'Providers/FirebaseRepositoryProvider'
import { GraphValue, compareGraphValues } from 'Providers/GraphProvider'
import { useRecords } from 'Providers/GraphValuesProvider/RecordsProvider'
import { useScenario } from 'Providers/ScenarioProvider'

import { ModeType } from 'Modes/const'
import { addTransaction, deleteTransaction, updateTransaction } from './GenericFunctions'
import { GenericValues, GenericValuesContext } from './TransactionTypes'

export type ExpectationsContextType = GenericValuesContext<Expectation>

class Expectations extends GenericValues<Expectation> { }

export type GraphExpectation = GraphValue & { metadata: { influences: Expectation[] } }

interface ExpectationParameter {
    startDate?: Date
    endDate?: Date
    updateDay?: number
    amount?: number
    mode?: string
    name: string
    id?: string
    new?: boolean
    edited?: boolean
}

export class Expectation {
    startDate: Date
    endDate: Date
    amount: number
    mode: ModeType
    name: string
    updateDay?: number
    id?: string
    new?: boolean
    edited?: boolean

    constructor({ startDate, endDate, amount, id, mode, name, updateDay }: ExpectationParameter) {
        this.id = id
        this.startDate = getValidDate(startDate)
        this.endDate = getValidDate(endDate)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.mode = mode && Object.values(modeNames).includes(mode as ModeType) ? mode as ModeType : modeNames.ONE_TIME
        this.name = name ?? 'New Expectation'
        this.updateDay = updateDay ?? 1
    }
}

const ExpectationsContext = createContext<ExpectationsContextType>(new Expectations([], [], () => { }, () => { }, () => { }, true))

interface ExpectationFirestore {
    startDate: string,
    endDate: string,
    updateDay?: string
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
            updateDay: expectation.updateDay?.toString(),
            mode: expectation.mode,
            name: expectation.name
        }
    },
    fromFirestore(snapshot: any, options?: any): Expectation {
        const expectationDb: ExpectationFirestore = snapshot.data()
        const startDate = new Date(expectationDb.startDate.replace(/-/g, "/"))
        const endDate = new Date(expectationDb.endDate.replace(/-/g, "/"))
        const amount = parseInt(expectationDb.amount)
        const mode = expectationDb.mode
        const name = expectationDb.name
        const id = snapshot.id
        const updateDay = expectationDb.updateDay ? parseInt(expectationDb.updateDay) : undefined
        return new Expectation({ startDate, endDate, amount, id, mode, name, updateDay })
    }
}

type SortExpectationsFunction = (expectation1: Expectation, expectation2: Expectation) => number

export const ExpectationsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { scenario, scenarioDoc } = useScenario()
    const { addDoc, deleteDoc, setDoc } = useFirebaseRepository()

    let startDateRecords = scenario.startDate
    let endDate = scenario.endDate
    let startAmount = 0

    const { graphValues } = useRecords()
    if (graphValues !== null && graphValues.length > 0) {
        const lastRecord = graphValues[graphValues.length - 1]
        startDateRecords = lastRecord.x
        startAmount = lastRecord.y
    }

    const sortExpectationsFunction = useCallback<SortExpectationsFunction>((expectation1, expectation2) => {
        function getDate(expectation: Expectation) {
            // If mode is periodical, and relevant, add it just after "Last Recorded Date" label
            if (expectation.mode !== 'One time') {
                if (
                    expectation.startDate.getTime() < startDateRecords.getTime() &&
                    expectation.endDate.getTime() > startDateRecords.getTime()
                ) {
                    return startDateRecords.getTime()
                }
            }
            return expectation.startDate.getTime()
        }
        return getDate(expectation1) - getDate(expectation2)

    }, [startDateRecords])

    const [expectations, setExpectations] = useState<Expectation[] | null>(null)
    const [graphExpectations, setGraphExpectations] = useState<GraphValue[] | null>(null)
    const [expectationsCollection, setExpectationsCollection] = useState<CollectionReference<Expectation> | null>(null)

    const [newExpectation, setNewExpectation] = useState(new Expectation({ startDate: scenario.startDate, endDate: scenario.endDate, amount: 0, mode: modeNames.ONE_TIME, name: 'New Expectation' }))

    const [isLoadingExpectations, setIsLoadingExpectations] = useState<boolean>(true)

    useEffect(() => {
        if (scenarioDoc) {
            setExpectationsCollection(collection(scenarioDoc, 'expectations').withConverter(converter))
        } else {
            setExpectationsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (expectationsCollection) {
            setIsLoadingExpectations(true)
            getDocs(expectationsCollection)
                .then((querySnapshot) => {
                    console.log('ExpectationsProvider Full read get', querySnapshot.size)

                    const expectationsQueried: Expectation[] = []
                    querySnapshot.forEach(doc => {
                        expectationsQueried.push(doc.data())
                    })

                    expectationsQueried.sort(sortExpectationsFunction)
                    setExpectations(expectationsQueried)
                    setIsLoadingExpectations(false)
                })
                .catch(reason => console.log(reason))
        } else {
            setExpectations(null)
        }

    }, [expectationsCollection, sortExpectationsFunction])

    const addExpectation = useCallback(() => {
        addTransaction<Expectation>(
            newExpectation,
            expectations,
            expectationsCollection,
            addDoc,
            setExpectations,
            () => { setNewExpectation(new Expectation({ startDate: scenario.startDate, endDate: scenario.endDate, amount: 0, mode: modeNames.ONE_TIME, name: 'New Expectation' })) },
            sortExpectationsFunction
        )
    }, [addDoc, expectations, expectationsCollection, sortExpectationsFunction, newExpectation, scenario.endDate, scenario.startDate])

    const deleteExpectation = useCallback((expectation: Expectation) => {
        deleteTransaction<Expectation>(
            expectation,
            expectations,
            expectationsCollection,
            setExpectations,
            deleteDoc
        )
    }, [deleteDoc, expectations, expectationsCollection])

    const updateExpectation = useCallback((expectation: Expectation) => {
        updateTransaction<Expectation>(
            expectation,
            expectations,
            expectationsCollection,
            sortExpectationsFunction,
            setExpectations,
            setDoc
        )
    }, [expectations, expectationsCollection, setDoc, sortExpectationsFunction])

    useEffect(() => {
        const getEngine = (startDateRecords: Date, endDate: Date, startAmount: number) => {
            const engine = new ForecastEngine(startDateRecords, endDate, startAmount)

            expectations?.forEach(expectation => engine.addEntry(new modes[expectation.mode](expectation)))

            return engine
        }

        if (expectations === null) return
        console.log('ExpectationsProvider compute graph expectations:', startDateRecords.toLocaleDateString('en-US'), endDate.toLocaleDateString('en-US'), startAmount, expectations?.length)
        const engine = getEngine(startDateRecords, endDate, startAmount)

        engine.iterate()
        const updatedGraphExpectations: GraphExpectation[] = engine.values?.map((computedValue): GraphExpectation => {
            return {
                x: new Date(computedValue.date),
                y: computedValue.value,
                metadata: { influences: computedValue.influences }
            }
        })

        updatedGraphExpectations?.sort(compareGraphValues)
        setGraphExpectations(updatedGraphExpectations)
    }, [expectations, startDateRecords, endDate, startAmount])

    const expectationsWithDummy = useMemo(() => {
        const dummyStartRecords = new Expectation({ startDate: startDateRecords, endDate: startDateRecords, amount: startAmount, id: 'startRecords', name: 'startRecords' })
        const dummyStartScenario = new Expectation({ startDate: scenario.startDate, endDate: scenario.startDate, amount: startAmount, id: 'startScenario', name: 'startScenario' })
        const dummyEndScenario = new Expectation({ startDate: scenario.endDate, endDate: scenario.endDate, amount: startAmount, id: 'endScenario', name: 'endScenario', mode: modeNames.MONTHLY })

        let expectationsWithDummy: Expectation[] = []

        if (expectations && expectations.length > 0) {
            if (startDateRecords > scenario.startDate && expectations.find((expectation) => sortExpectationsFunction(expectation, dummyStartScenario) > 0 && sortExpectationsFunction(expectation, dummyStartRecords) < 0)) expectationsWithDummy.push(dummyStartRecords)
            if (expectations.find((expectation) => sortExpectationsFunction(expectation, dummyStartScenario) < 0)) expectationsWithDummy.push(dummyStartScenario)
            if (expectations.find((expectation) => sortExpectationsFunction(expectation, dummyEndScenario) > 0)) expectationsWithDummy.push(dummyEndScenario)

            expectationsWithDummy = expectationsWithDummy.concat(expectations).sort(sortExpectationsFunction)
        }
        return expectationsWithDummy

    }, [expectations, scenario.endDate, scenario.startDate, startAmount, startDateRecords, sortExpectationsFunction])

    const value = useMemo(
        () => new Expectations(expectationsWithDummy, graphExpectations, addExpectation, deleteExpectation, updateExpectation, isLoadingExpectations),
        [addExpectation, deleteExpectation, expectationsWithDummy, graphExpectations, isLoadingExpectations, updateExpectation]
    )

    return (
        <ExpectationsContext.Provider
            value={value}
        >
            {children}
        </ExpectationsContext.Provider>
    )

}

export const useExpectations = (): ExpectationsContextType => {
    return useContext(ExpectationsContext)
}