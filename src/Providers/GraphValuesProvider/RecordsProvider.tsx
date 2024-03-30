import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { CollectionReference, FirestoreDataConverter, collection, getDocs } from 'firebase/firestore'

import { getFormattedDate, getValidDate } from 'helpers'

import { useFirebaseRepository } from 'Providers/FirebaseRepositoryProvider'
import { GraphValue, compareGraphValues } from 'Providers/GraphProvider'
import { GenericValues, GenericValuesContext } from 'Providers/GraphValuesProvider/TransactionTypes'
import { useScenario } from 'Providers/ScenarioProvider'
import { addTransaction, deleteTransaction, updateTransaction } from './GenericFunctions'

export type RecordsContextType = GenericValuesContext<Record> & { graphValuesUnselected: GraphValue[] | null }

class Records extends GenericValues<Record> {
    graphValuesUnselected: GraphValue[] | null

    constructor(
        values: Record[] | null,
        graphValues: GraphValue[] | null,
        addValue: () => void,
        deleteValue: (transaction: Record) => void,
        updateValue: (newRecord: Record) => void,
        isLoading: boolean,
        graphValuesUnselected: GraphValue[] | null) {

        super(values, graphValues, addValue, deleteValue, updateValue, isLoading)

        this.graphValuesUnselected = graphValuesUnselected
    }
}

interface RecordParameter {
    date?: Date
    amount?: number
    id?: string
    new?: boolean
    edited?: boolean
    isPinned?: boolean
}

export class Record {
    date: Date
    amount: number
    isPinned: boolean
    id?: string
    new?: boolean
    edited?: boolean

    constructor({ date, amount, id, isPinned }: RecordParameter) {
        this.date = getValidDate(date)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.isPinned = isPinned === undefined ? false : isPinned
        this.id = id
    }
}

const RecordsContext = createContext<RecordsContextType>(new Records([], [], () => { }, () => { }, () => { }, true, []))

interface RecordFirestore {
    date: string,
    amount: string,
    isPinned: boolean
}

const converter: FirestoreDataConverter<Record> = {
    toFirestore(record: Record): RecordFirestore {
        console.log(record)
        return { date: getFormattedDate(record.date), amount: record.amount.toString(), isPinned: record.isPinned };
    },
    fromFirestore(snapshot: any, options?: any): Record {
        const recordDb: RecordFirestore = snapshot.data()
        const date = new Date(recordDb.date)
        const amount = parseInt(recordDb.amount)
        const id = snapshot.id
        const isPinned = recordDb.isPinned
        return new Record({ date, amount, id, isPinned })
    }
}

const sortRecordsFunction = (record1: Record, record2: Record): number => {
    return record2.date.getTime() - record1.date.getTime()
}

export const RecordsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { scenarioDoc, scenario } = useScenario()
    const { startDate, endDate } = scenario
    const { addDoc, deleteDoc, setDoc } = useFirebaseRepository()

    const [records, setRecords] = useState<Record[] | null>(null)
    const [graphRecords, setGraphRecords] = useState<GraphValue[] | null>([])
    const [graphRecordsUnselected, setGraphRecordsUnselected] = useState<GraphValue[] | null>([])
    const [recordsCollection, setRecordsCollection] = useState<CollectionReference<Record> | null>(null)

    const [newRecord, setNewRecord] = useState(new Record({}))

    const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(true)

    useEffect(() => {
        if (scenarioDoc) {
            setRecordsCollection(collection(scenarioDoc, 'records').withConverter(converter))
        } else {
            setRecordsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (recordsCollection) {
            setIsLoadingRecords(true)
            getDocs(recordsCollection)
                .then((querySnapshot) => {
                    console.log('RecordsProvider Full read get', querySnapshot.size)

                    const recordsQueried: Record[] = []

                    querySnapshot.forEach(doc => {
                        recordsQueried.push(doc.data())
                    })

                    recordsQueried.sort(sortRecordsFunction)
                    setRecords(recordsQueried)
                    setIsLoadingRecords(false)
                })
                .catch(reason => console.log(reason))
        } else {
            setRecords(null)
        }

    }, [recordsCollection])

    const addRecord = useCallback(() => {
        addTransaction<Record>(
            newRecord,
            records,
            recordsCollection,
            addDoc,
            setRecords,
            () => { setNewRecord(new Record({})) },
            sortRecordsFunction
        )
    }, [addDoc, newRecord, records, recordsCollection])

    const deleteRecord = useCallback((record: Record) => {
        deleteTransaction<Record>(
            record,
            records,
            recordsCollection,
            setRecords,
            deleteDoc
        )
    }, [deleteDoc, records, recordsCollection])

    const updateRecord = useCallback((record: Record) => {
        updateTransaction<Record>(
            record,
            records,
            recordsCollection,
            sortRecordsFunction,
            setRecords,
            setDoc
        )
    }, [records, recordsCollection, setDoc])

    useEffect(() => {
        if (records === null) return

        console.log('RecordsProvider compute graph records:', startDate.toLocaleDateString('en-US'), endDate.toLocaleDateString('en-US'), records?.length)
        const updatedGraphRecords: { x: Date, y: number, isPinned?: boolean }[] = []

        updatedGraphRecords.push({
            x: new Date(startDate),
            y: 0
        })

        records?.forEach(record => {
            if (record.date >= startDate && record.date <= endDate) {
                updatedGraphRecords.push({
                    x: new Date(record.date),
                    y: record.amount,
                    isPinned: record.isPinned
                })
            }
        })

        updatedGraphRecords.sort(compareGraphValues)

        const lastPinnedIndexReversed = updatedGraphRecords.slice().reverse().findIndex(record => record.isPinned)
        const thereIsNoPinned = lastPinnedIndexReversed === -1

        if (thereIsNoPinned || lastPinnedIndexReversed === 0) {
            setGraphRecords(updatedGraphRecords)
            setGraphRecordsUnselected([])
        } else {

            setGraphRecords(updatedGraphRecords.slice(0, -lastPinnedIndexReversed))
            setGraphRecordsUnselected(updatedGraphRecords.slice(-(lastPinnedIndexReversed + 1)))
        }
    }, [records, startDate, endDate])

    const recordsWithDummy = useMemo(() => {
        const dummyStartScenario = new Record({ date: scenario.startDate, id: 'startScenario' })
        const dummyEndScenario = new Record({ date: scenario.endDate, id: 'endScenario' })

        let recordsWithDummy: Record[] = []

        if (records && records.length > 0) {
            if (records.find((record) => sortRecordsFunction(record, dummyStartScenario) > 0)) recordsWithDummy.push(dummyStartScenario)
            if (records.find((record) => sortRecordsFunction(record, dummyEndScenario) < 0)) recordsWithDummy.push(dummyEndScenario)

            return recordsWithDummy.concat(records).sort(sortRecordsFunction)
        }
        return recordsWithDummy
    }, [records, scenario.endDate, scenario.startDate])

    const value = useMemo(
        () => new Records(recordsWithDummy, graphRecords, addRecord, deleteRecord, updateRecord, isLoadingRecords, graphRecordsUnselected),
        [addRecord, deleteRecord, graphRecords, isLoadingRecords, recordsWithDummy, updateRecord, graphRecordsUnselected]
    )
    return (
        <RecordsContext.Provider value={value}>
            {children}
        </RecordsContext.Provider>
    )

}

export const useRecords = (): RecordsContextType => {
    return useContext(RecordsContext)
}