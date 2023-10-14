import React, { createContext, useContext, useEffect, useState } from 'react'

import { CollectionReference, FirestoreDataConverter, collection, getDocs } from 'firebase/firestore'

import { useFirebaseRepository } from 'Providers/FirebaseRepositoryProvider'
import { GraphValue } from 'Providers/GraphProvider'
import { GenericValues, GenericValuesContext } from 'Providers/GraphValuesProvider/TransactionTypes'
import { useScenario } from 'Providers/ScenarioProvider'

import { getFormattedDate, getValidDate } from 'helpers'
import { addTransaction, deleteTransaction, updateTransaction } from './GenericFunctions'

export type LimitsContextType = GenericValuesContext<Limit>

class Limits extends GenericValues<Limit> { }

interface LimitParameter {
    startDate?: Date
    endDate?: Date
    amount?: number
    id?: string
    new?: boolean
    edited?: boolean
}

export class Limit {
    startDate: Date
    endDate: Date
    amount: number
    id?: string
    new?: boolean
    edited?: boolean

    constructor({ startDate, endDate, amount, id }: LimitParameter) {
        this.id = id
        this.startDate = getValidDate(startDate)
        this.endDate = getValidDate(endDate)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
    }
}

const LimitsContext = createContext<LimitsContextType>(new Limits([], [], () => { }, () => { }, () => { }, true))

interface LimitFirestore {
    startDate: string,
    endDate: string,
    amount: string
}

const converter: FirestoreDataConverter<Limit> = {
    toFirestore(limit: Limit): LimitFirestore {
        console.log(limit)
        return {
            startDate: getFormattedDate(limit.startDate),
            endDate: getFormattedDate(limit.endDate),
            amount: limit.amount.toString()
        }
    },
    fromFirestore(snapshot: any, options?: any): Limit {
        const limitDb: LimitFirestore = snapshot.data()
        const startDate = new Date(limitDb.startDate)
        const endDate = new Date(limitDb.endDate)
        const amount = parseInt(limitDb.amount)
        const id = snapshot.id
        return new Limit({ startDate, endDate, amount, id })
    }
}

const sortLimitsFunction = (limit1: Limit, limit2: Limit): number => {
    return limit1.startDate.getTime() - limit2.startDate.getTime()
}

export const LimitsProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { scenarioDoc, scenario } = useScenario()
    const { startDate, endDate } = scenario
    const { addDoc, deleteDoc, setDoc } = useFirebaseRepository()

    const [limits, setLimits] = useState<Limit[] | null>(null)
    const [graphLimits, setGraphLimits] = useState<GraphValue[] | null>(null)
    const [limitsCollection, setLimitsCollection] = useState<CollectionReference<Limit> | null>(null)

    const [newLimit, setNewLimit] = useState(new Limit({ startDate: startDate, endDate: endDate, amount: 0 }))

    const [isLoadingLimits, setIsLoadingLimits] = useState<boolean>(true)

    useEffect(() => {
        if (scenarioDoc) {
            setLimitsCollection(collection(scenarioDoc, 'limits').withConverter(converter))
        } else {
            setLimitsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (limitsCollection) {
            setIsLoadingLimits(true)
            getDocs(limitsCollection)
                .then((querySnapshot) => {
                    console.log('LimitsProvider Full read get', querySnapshot.size)

                    const limitsQueried: Limit[] = []
                    querySnapshot.forEach(doc => {
                        limitsQueried.push(doc.data())
                    })

                    limitsQueried.sort(sortLimitsFunction)
                    setLimits(limitsQueried)
                    setIsLoadingLimits(false)
                })
                .catch(reason => console.log(reason))
        } else {
            setLimits(null)
        }

    }, [limitsCollection])

    const addLimit = () => {
        addTransaction<Limit>(
            newLimit,
            limits,
            limitsCollection,
            addDoc,
            setLimits,
            () => { setNewLimit(new Limit({ startDate: startDate, endDate: endDate, amount: 0 })) },
            sortLimitsFunction
        )
    }

    const deleteLimit = (limit: Limit) => {
        deleteTransaction<Limit>(
            limit,
            limits,
            limitsCollection,
            setLimits,
            deleteDoc
        )
    }

    const updateLimit = (limit: Limit) => {
        updateTransaction<Limit>(
            limit,
            limits,
            limitsCollection,
            sortLimitsFunction,
            setLimits,
            setDoc
        )
    }

    useEffect(() => {
        if (limits === null) return

        console.log('LimitsProvider compute graph values:', startDate.toLocaleDateString('en-US'), endDate.toLocaleDateString('en-US'), limits?.length)
        const updatedGraphLimits = []

        const validLimits = limits.filter(limit =>
            limit.startDate <= endDate &&
            limit.endDate >= startDate &&
            limit.startDate <= limit.endDate)

        const startDateLimits = [...validLimits].sort((limitA: Limit, limitB: Limit) => limitA.startDate.getTime() - limitB.startDate.getTime())
        const endDateLimits = validLimits.sort((limitA: Limit, limitB: Limit) => limitA.endDate.getTime() - limitB.endDate.getTime())

        let startDateIndex = 0
        let endDateIndex = 0

        let currentAmount = 0

        while (startDateIndex + endDateIndex < startDateLimits.length * 2) {
            const currentStartLimit = startDateLimits[startDateIndex]
            const currentEndLimit = endDateLimits[endDateIndex]

            if (currentStartLimit?.startDate <= currentEndLimit?.endDate) {
                let date = currentStartLimit.startDate

                if (date < startDate) {
                    date = new Date(startDate)
                }

                updatedGraphLimits.push({
                    x: new Date(date),
                    y: currentAmount,
                })
                currentAmount += currentStartLimit.amount
                updatedGraphLimits.push({
                    x: new Date(date),
                    y: currentAmount,
                })
                startDateIndex++

            } else {
                let date = currentEndLimit.endDate

                if (date > endDate) {
                    date = new Date(endDate)
                }

                updatedGraphLimits.push({
                    x: new Date(date),
                    y: currentAmount,
                })
                currentAmount -= currentEndLimit.amount
                updatedGraphLimits.push({
                    x: new Date(date),
                    y: currentAmount,
                })
                endDateIndex++
            }
        }

        setGraphLimits(updatedGraphLimits)
    }, [limits, startDate, endDate])

    const dummyStartScenario = new Limit({ startDate: scenario.startDate, endDate: scenario.startDate, id: 'startScenario' })
    const dummyEndScenario = new Limit({ startDate: scenario.endDate, endDate: scenario.endDate, id: 'endScenario' })

    let limitsWithDummy: Limit[] = []

    if (limits && limits.length > 0) {
        if (limits.find((limit) => sortLimitsFunction(limit, dummyStartScenario) < 0)) limitsWithDummy.push(dummyStartScenario)
        if (limits.find((limit) => sortLimitsFunction(limit, dummyEndScenario) > 0)) limitsWithDummy.push(dummyEndScenario)

        limitsWithDummy = limitsWithDummy.concat(limits).sort(sortLimitsFunction)
    }

    return (
        <LimitsContext.Provider
            value={(new Limits(limitsWithDummy, graphLimits, addLimit, deleteLimit, updateLimit, isLoadingLimits))}
        >
            {children}
        </LimitsContext.Provider>
    )

}

export const useLimits = (): LimitsContextType => {
    return useContext(LimitsContext)
}