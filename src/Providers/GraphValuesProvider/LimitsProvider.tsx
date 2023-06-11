import { CollectionReference, FirestoreDataConverter, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate, getValidDate } from "../../helpers"
import { GraphValue } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"
import { GenericValues, GenericValuesContext } from "./GenericValues"

const currentDate = new Date()

export type LimitsContextType = GenericValuesContext<Limit>

const Limits = GenericValues<Limit>

interface LimitParameter {
    startDate?: Date
    endDate?: Date
    amount?: number
    id?: string
}

export class Limit {
    startDate: Date
    endDate: Date
    amount: number
    id?: string

    constructor({ startDate, endDate, amount, id }: LimitParameter) {
        this.id = id
        this.startDate = getValidDate(startDate)
        this.endDate = getValidDate(endDate)
        this.amount = amount !== undefined && !isNaN(amount) ? amount : 0
    }
}

const LimitsContext = createContext<LimitsContextType>(new Limits([], [], () => { }, () => { }, () => { }))

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

    const [limits, setLimits] = useState<Limit[] | null>(null)
    const [graphLimits, setGraphLimits] = useState<GraphValue[] | null>(null)
    const [limitsCollection, setLimitsCollection] = useState<CollectionReference | null>(null)

    const [newLimit, setNewLimit] = useState(new Limit({ startDate: currentDate, endDate: currentDate, amount: 0 }))

    useEffect(() => {
        if (scenarioDoc) {
            setLimitsCollection(collection(scenarioDoc, 'limits').withConverter(converter))
        } else {
            setLimitsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (limitsCollection) {
            getDocs(limitsCollection)
                .then((querySnapshot) => {
                    console.log("LimitsProvider Full read get", querySnapshot.size)

                    const limitsQueried: Limit[] = []
                    querySnapshot.forEach(doc => {
                        limitsQueried.push(converter.fromFirestore(doc))
                    })

                    limitsQueried.sort(sortLimitsFunction)
                    setLimits(limitsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setLimits(null)
        }

    }, [limitsCollection])

    const addLimit = (): void => {
        console.log("add", newLimit)

        if (limitsCollection === null || limits === null) {
            return
        }

        addDoc(limitsCollection, newLimit).then(document => {
            newLimit.id = document.id

            const newLimits = [newLimit, ...limits]
            newLimits.sort(sortLimitsFunction)
            setLimits(newLimits)

            setNewLimit(new Limit({ startDate: currentDate, endDate: currentDate, amount: 0 }))
        })
    }

    const deleteLimit = (limit: Limit, index: number): void => {
        console.log("delete", limit)

        if (limitsCollection === null || limits === null) {
            return
        }

        const updatedLimits = [...limits]
        updatedLimits.splice(index, 1)
        setLimits(updatedLimits)

        deleteDoc(doc(limitsCollection, limit.id))
    }

    const updateLimit = (limit: Limit, index: number): void => {
        console.log("update", limit)

        if (limitsCollection === null || limits === null) {
            return
        }

        const updatedLimits = [...limits]
        updatedLimits[index] = limit

        updatedLimits.sort(sortLimitsFunction)
        setLimits(updatedLimits)

        setDoc(doc(limitsCollection, limit.id), limit)
    }


    useEffect(() => {
        if (limits === null) return

        console.log("LimitsProvider compute graph values:", startDate.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), limits?.length)
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

    return (
        <LimitsContext.Provider
            value={(new Limits(limits, graphLimits, addLimit, deleteLimit, updateLimit))}
        >
            {children}
        </LimitsContext.Provider>
    )

}

export const useLimits = (): LimitsContextType => {
    return useContext(LimitsContext)
}