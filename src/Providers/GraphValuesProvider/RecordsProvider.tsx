import React, { createContext, useContext, useEffect, useState } from 'react'

import { CollectionReference, FirestoreDataConverter, collection, getDocs } from 'firebase/firestore'

import { getFormattedDate, getValidDate } from 'helpers'

import { useFirebaseRepository } from 'Providers/FirebaseRepositoryProvider'
import { GraphValue, compareGraphValues } from 'Providers/GraphProvider'
import { GenericValues, GenericValuesContext } from 'Providers/GraphValuesProvider/TransactionTypes'
import { useScenario } from 'Providers/ScenarioProvider'
import { addTransaction, deleteTransaction, updateTransaction } from './GenericFunctions'

export type RecordsContextType = GenericValuesContext<Record>

const Records = GenericValues<Record>

interface RecordParameter {
    date?: Date
    amount?: number
    id?: string
    new?: boolean
    edited?: boolean
}

export class Record {
    date: Date
    amount: number
    id?: string
    new?: boolean
    edited?: boolean

    constructor({ date, amount, id }: RecordParameter) {
        this.date = getValidDate(date)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.id = id
    }
}

const RecordsContext = createContext<RecordsContextType>(new Records([], [], () => { }, () => { }, () => { }, true))

interface RecordFirestore {
    date: string,
    amount: string
}

const converter: FirestoreDataConverter<Record> = {
    toFirestore(record: Record): RecordFirestore {
        console.log(record)
        return { date: getFormattedDate(record.date), amount: record.amount.toString() };
    },
    fromFirestore(snapshot: any, options?: any): Record {
        const recordDb: RecordFirestore = snapshot.data()
        const date = new Date(recordDb.date)
        const amount = parseInt(recordDb.amount)
        const id = snapshot.id
        return new Record({ date, amount, id })
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

    const addRecord = () => {
        addTransaction<Record>(
            newRecord,
            records,
            recordsCollection,
            addDoc,
            setRecords,
            () => { setNewRecord(new Record({})) },
            sortRecordsFunction
        )
    }

    const deleteRecord = (record: Record) => {
        deleteTransaction<Record>(
            record,
            records,
            recordsCollection,
            setRecords,
            deleteDoc
        )
    }

    const updateRecord = (record: Record) => {
        updateTransaction<Record>(
            record,
            records,
            recordsCollection,
            sortRecordsFunction,
            setRecords,
            setDoc
        )
    }

    useEffect(() => {
        if (records === null) return

        console.log('RecordsProvider compute graph records:', startDate.toLocaleDateString('en-US'), endDate.toLocaleDateString('en-US'), records?.length)
        const updatedGraphRecords = []

        updatedGraphRecords.push({
            x: new Date(startDate),
            y: 0
        })

        records?.forEach(record => {
            if (record.date >= startDate && record.date <= endDate) {
                updatedGraphRecords.push({
                    x: new Date(record.date),
                    y: record.amount,
                })
            }
        })

        updatedGraphRecords.sort(compareGraphValues)
        setGraphRecords(updatedGraphRecords)
    }, [records, startDate, endDate])

    const dummyStartScenario = new Record({ date: scenario.startDate, id: 'startScenario' })
    const dummyEndScenario = new Record({ date: scenario.endDate, id: 'endScenario' })

    let recordsWithDummy: Record[] = []

    if (records && records.length > 0) {
        if (records.find((record) => sortRecordsFunction(record, dummyStartScenario) > 0)) recordsWithDummy.push(dummyStartScenario)
        if (records.find((record) => sortRecordsFunction(record, dummyEndScenario) < 0)) recordsWithDummy.push(dummyEndScenario)

        recordsWithDummy = recordsWithDummy.concat(records).sort(sortRecordsFunction)
    }

    return (
        <RecordsContext.Provider value={(new Records(recordsWithDummy, graphRecords, addRecord, deleteRecord, updateRecord, isLoadingRecords))}>
            {children}
        </RecordsContext.Provider>
    )

}

export const useRecords = (): RecordsContextType => {
    return useContext(RecordsContext)
}