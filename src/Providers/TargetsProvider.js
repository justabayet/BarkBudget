
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useDatabase } from "./DatabaseProvider"
import { getFormattedDate } from "../helpers"

const currentDate = getFormattedDate(new Date())

class Targets {
    constructor(targets, addTarget, deleteTarget, updateTarget) {
        this.values = targets
        this.addValue = addTarget
        this.deleteValue = deleteTarget
        this.updateValue = updateTarget
    }
}

const TargetsContext = createContext(new Targets([], () => {}, () => {}, () => {}))

export const TargetsProvider = (props) => {
    const { database } = useDatabase()

    const [targets, setTargets] = useState(null)
    const [targetsCollection, setTargetsCollection] = useState(null)

    const [newValue, setNewValue] = useState({ date: currentDate, amount: 0 })

    useEffect(() => {
        if(database) {
            setTargetsCollection(collection(database, 'targets'))
        } else {
            setTargetsCollection(null)
        }

    }, [database])

    useEffect(() => {
        if (targetsCollection) {
            console.log("full read targets")
            getDocs(targetsCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

                    const targetsQueried = []

                    querySnapshot.forEach(doc => {
                        const data = doc.data()
                        data.id = doc.id

                        targetsQueried.push(data)
                    })

                    setTargets(targetsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setTargets(null)
        }

    }, [targetsCollection])

    const addTarget = () => {
        console.log("add", newValue)
        addDoc(targetsCollection, newValue).then(document => {
            newValue.id = document.id
        })
        setTargets([newValue, ...targets])
        setNewValue({ date: currentDate, amount: 0 })
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

        const { id, ...newTarget } = target

        setDoc(doc(targetsCollection, id), newTarget)
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