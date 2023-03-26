
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate, compareGraphValues } from "../../helpers"
import { useScenario } from "../ScenarioProvider"

const currentDate = new Date()

class Limits {
    constructor(limits, addLimit, deleteLimit, updateLimit) {
        this.values = limits
        this.addValue = addLimit
        this.deleteValue = deleteLimit
        this.updateValue = updateLimit
    }
}

class Limit {
    constructor({ date, amount, id }) {
        this.date = date
        this.amount = amount
        this.id = id
    }
}

const LimitsContext = createContext(new Limits([], () => { }, () => { }, () => { }))

const converter = {
    toFirestore(limit) {
        console.log(limit)
        return { date: getFormattedDate(limit.date), amount: limit.amount };
    },
    fromFirestore(snapshot, options) {
        const limitDb = snapshot.data()
        const date = new Date(limitDb.date)
        const amount = limitDb.amount
        const id = snapshot.id
        return new Limit({ date, amount, id })
    }
}

export const LimitsProvider = (props) => {
    const { scenarioDoc } = useScenario()

    const [limits, setLimits] = useState(null)
    const [limitsCollection, setLimitsCollection] = useState(null)

    const [newLimit, setNewLimit] = useState(new Limit({ date: currentDate, amount: 0 }))

    useEffect(() => {
        if (scenarioDoc) {
            setLimitsCollection(collection(scenarioDoc, 'limits').withConverter(converter))
        } else {
            setLimitsCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (limitsCollection) {
            console.log("full read limits")
            getDocs(limitsCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

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
        })
        setLimits([newLimit, ...limits])
        setNewLimit(new Limit({ date: currentDate, amount: 0 }))
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

    return (
        <LimitsContext.Provider
            value={(new Limits(limits, addLimit, deleteLimit, updateLimit))}
        >
            {props.children}
        </LimitsContext.Provider>
    )

}

export const useLimits = () => {
    return useContext(LimitsContext)
}