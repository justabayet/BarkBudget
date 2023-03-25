
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useScenario } from "./ScenarioProvider"

const currentDate = getFormattedDate(new Date())

class Targets {
    constructor(targets, addTarget, deleteTarget, updateTarget) {
        this.values = targets
        this.addValue = addTarget
        this.deleteValue = deleteTarget
        this.updateValue = updateTarget
    }
}

class Target {
    constructor({ date, amount, id }) {
        this.date = date
        this.amount = amount
        this.id = id
    }
}

const TargetsContext = createContext(new Targets([], () => {}, () => {}, () => {}))

const converter = {
    toFirestore(target) {
        console.log(target)
        return { date: getFormattedDate(target.date), amount: target.amount };
    },
    fromFirestore(snapshot, options) {
        const targetDb = snapshot.data()
        const date = new Date(targetDb.date)
        const amount = targetDb.amount
        const id = snapshot.id
        return new Target({ date, amount, id })
    }
}

export const TargetsProvider = (props) => {
    const { scenarioCollection } = useScenario()

    const [targets, setTargets] = useState(null)
    const [targetsCollection, setTargetsCollection] = useState(null)

    const [newTarget, setNewTarget] = useState(new Target({ date: currentDate, amount: 0 }))

    useEffect(() => {
        if(scenarioCollection) {
            setTargetsCollection(collection(scenarioCollection, 'targets').withConverter(converter))
        } else {
            setTargetsCollection(null)
        }

    }, [scenarioCollection])

    useEffect(() => {
        if (targetsCollection) {
            console.log("full read targets")
            getDocs(targetsCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

                    const targetsQueried = []
                    querySnapshot.forEach(doc => {
                        targetsQueried.push(converter.fromFirestore(doc))
                    })

                    setTargets(targetsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setTargets(null)
        }
    }, [targetsCollection])

    const addTarget = () => {
        console.log("add", newTarget)
        addDoc(targetsCollection, newTarget).then(document => {
            newTarget.id = document.id
        })
        setTargets([newTarget, ...targets])
        setNewTarget(new Target({ date: currentDate, amount: 0 }))
    }

    const deleteTarget = (target, index) => {
        console.log("delete", target)
        const updatedTargets = [...targets]
        updatedTargets.splice(index, 1)
        setTargets(updatedTargets)

        deleteDoc(doc(targetsCollection, target.id))
    }

    const updateTarget = (target, index) => {
        console.log("update", target)
        const updatedTargets = [...targets]
        updatedTargets[index] = target
        setTargets(updatedTargets)

        setDoc(doc(targetsCollection, target.id), target)
    }

    return (
        <TargetsContext.Provider
            value={(new Targets(targets, addTarget, deleteTarget, updateTarget))}
        >
            {props.children}
        </TargetsContext.Provider>
    )

}

export const useTargets = () => {
    return useContext(TargetsContext)
}