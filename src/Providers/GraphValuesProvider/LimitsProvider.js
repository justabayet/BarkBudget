
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../../helpers"
import { useScenario } from "../ScenarioProvider"

const currentDate = new Date()

class Limits {
    constructor(limits, graphLimits, addLimit, deleteLimit, updateLimit) {
        this.values = limits
        this.addValue = addLimit
        this.deleteValue = deleteLimit
        this.updateValue = updateLimit
        this.graphValues = graphLimits
    }
}

class Limit {
    constructor({ startDate, endDate, amount, id }) {
        this.startDate = startDate
        this.endDate = endDate
        this.amount = amount
        this.id = id

        if (this.startDate === undefined || isNaN(this.startDate)) {
            this.startDate = new Date()
        }

        if (this.endDate === undefined || isNaN(this.endDate)) {
            this.endDate = new Date()
        }

        if (isNaN(this.amount)) {
            this.amount = 0
        }
    }
}

const LimitsContext = createContext(new Limits([], [], () => { }, () => { }, () => { }))

const converter = {
    toFirestore(limit) {
        console.log(limit)
        return {
            startDate: getFormattedDate(limit.startDate),
            endDate: getFormattedDate(limit.endDate),
            amount: limit.amount
        }
    },
    fromFirestore(snapshot, options) {
        const limitDb = snapshot.data()
        const startDate = new Date(limitDb.startDate)
        const endDate = new Date(limitDb.endDate)
        const amount = parseInt(limitDb.amount)
        const id = snapshot.id
        return new Limit({ startDate, endDate, amount, id })
    }
}

export const LimitsProvider = (props) => {
    const { scenarioDoc, scenario } = useScenario()
    const { startDate, endDate } = scenario

    const [limits, setLimits] = useState(null)
    const [graphLimits, setGraphLimits] = useState(null)
    const [limitsCollection, setLimitsCollection] = useState(null)

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

                    const limitsQueried = []
                    querySnapshot.forEach(doc => {
                        limitsQueried.push(converter.fromFirestore(doc))
                    })

                    setLimits(limitsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setLimits(null)
        }

    }, [limitsCollection])

    const addLimit = () => {
        console.log("add", newLimit)
        addDoc(limitsCollection, newLimit).then(document => {
            newLimit.id = document.id
            setLimits([newLimit, ...limits])
            setNewLimit(new Limit({ startDate: currentDate, endDate: currentDate, amount: 0 }))
        })
    }

    const deleteLimit = (limit, index) => {
        console.log("delete", limit)
        const updatedLimits = [...limits]
        updatedLimits.splice(index, 1)
        setLimits(updatedLimits)

        deleteDoc(doc(limitsCollection, limit.id))
    }

    const updateLimit = (limit, index) => {
        console.log("update", limit)
        const updatedLimits = [...limits]
        updatedLimits[index] = limit
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

        const startDateLimits = [...validLimits].sort((limitA, limitB) => limitA.startDate - limitB.startDate)
        const endDateLimits = validLimits.sort((limitA, limitB) => limitA.endDate - limitB.endDate)

        let startDateIndex = 0
        let endDateIndex = 0

        let currentAmount = 0

        while (startDateIndex + endDateIndex < startDateLimits.length * 2) {
            const currentStartLimit = startDateLimits[startDateIndex]
            const currentEndLimit = endDateLimits[endDateIndex]

            if (currentStartLimit?.startDate <= currentEndLimit?.endDate) {
                updatedGraphLimits.push({
                    x: new Date(currentStartLimit.startDate),
                    y: currentAmount,
                })
                currentAmount += currentStartLimit.amount
                updatedGraphLimits.push({
                    x: new Date(currentStartLimit.startDate),
                    y: currentAmount,
                })
                startDateIndex++

            } else {
                updatedGraphLimits.push({
                    x: new Date(currentEndLimit.endDate),
                    y: currentAmount,
                })
                currentAmount -= currentEndLimit.amount
                updatedGraphLimits.push({
                    x: new Date(currentEndLimit.endDate),
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
            {props.children}
        </LimitsContext.Provider>
    )

}

export const useLimits = () => {
    return useContext(LimitsContext)
}