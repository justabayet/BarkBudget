import { CollectionReference, FirestoreDataConverter, collection, doc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate, getValidDate } from "../../helpers"
import { useFirebaseRepository } from "../FirebaseRepositoryProvider"
import { GraphValue, compareGraphValues } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"
import { GenericValues, GenericValuesContext } from "./GenericValues"

export type RecordsContextType = GenericValuesContext<Record>

const Records = GenericValues<Record>

interface RecordParameter {
    date?: Date
    amount?: number
    id?: string
    new?: boolean
}

export class Record {
    date: Date
    amount: number
    id?: string
    new?: boolean

    constructor({ date, amount, id }: RecordParameter) {
        this.date = getValidDate(date)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
        this.id = id
    }
}

const RecordsContext = createContext<RecordsContextType>(new Records([], [], () => { }, () => { }, () => { }))

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
    const [recordsCollection, setRecordsCollection] = useState<CollectionReference | null>(null)

    const [newRecord, setNewRecord] = useState(new Record({}))

    useEffect(() => {
        if (scenarioDoc) {
            setRecordsCollection(collection(scenarioDoc, 'values').withConverter(converter))
        } else {
            setRecordsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (recordsCollection) {
            getDocs(recordsCollection)
                .then((querySnapshot) => {
                    console.log("RecordsProvider Full read get", querySnapshot.size)

                    const recordsQueried: Record[] = []

                    querySnapshot.forEach(doc => {
                        recordsQueried.push(converter.fromFirestore(doc))
                    })

                    recordsQueried.sort(sortRecordsFunction)
                    setRecords(recordsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setRecords(null)
        }

    }, [recordsCollection])

    const addRecord = (): void => {
        console.log("add", newRecord)

        if (recordsCollection === null || records === null) {
            return
        }

        addDoc(recordsCollection, newRecord).then(document => {
            newRecord.id = document.id
            newRecord.new = true

            records.forEach(record => record.new = false)

            const newRecords = [newRecord, ...records]
            newRecords.sort(sortRecordsFunction)
            setRecords(newRecords)

            setNewRecord(new Record({}))
        })
    }

    const getIndex = (id: string | undefined): number => {
        const index = records?.findIndex((record) => {
            return record.id === id
        })

        return index ? index : 0
    }

    const deleteRecord = (record: Record): void => {
        console.log("delete", record)

        if (recordsCollection === null || records === null) {
            return
        }

        const index: number = getIndex(record.id)

        console.log("delete", record)
        const updatedRecords = [...records]
        updatedRecords.splice(index, 1)
        setRecords(updatedRecords)

        deleteDoc(doc(recordsCollection, record.id))
    }

    const updateRecord = (record: Record): void => {
        console.log("update", record)

        if (recordsCollection === null || records === null) {
            return
        }

        const index: number = getIndex(record.id)

        const updatedRecords = [...records]
        updatedRecords[index] = record
        updatedRecords.sort(sortRecordsFunction)
        setRecords(updatedRecords)

        setDoc(doc(recordsCollection, record.id), record)
    }


    useEffect(() => {
        if (records === null) return

        console.log("RecordsProvider compute graph records:", startDate.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), records?.length)
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

    const dummyStartScenario = new Record({ date: scenario.startDate, id: "startScenario" })
    const dummyEndScenario = new Record({ date: scenario.endDate, id: "endScenario" })

    let recordsWithDummy: Record[] = []

    if (records && records.length > 0) {
        if (records.find((record) => sortRecordsFunction(record, dummyStartScenario) > 0)) recordsWithDummy.push(dummyStartScenario)
        if (records.find((record) => sortRecordsFunction(record, dummyEndScenario) < 0)) recordsWithDummy.push(dummyEndScenario)

        recordsWithDummy = recordsWithDummy.concat(records).sort(sortRecordsFunction)
    }

    return (
        <RecordsContext.Provider value={(new Records(recordsWithDummy, graphRecords, addRecord, deleteRecord, updateRecord))}>
            {children}
        </RecordsContext.Provider>
    )

}

export const useRecords = (): RecordsContextType => {
    return useContext(RecordsContext)
}