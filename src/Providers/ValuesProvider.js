
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useDatabase } from "./DatabaseProvider"
import { getFormattedDate } from "../helpers"

const currentDate = getFormattedDate(new Date())

class Values {
    constructor(values, addValue, deleteValue, updateValue) {
        this.values = values
        this.addValue = addValue
        this.deleteValue = deleteValue
        this.updateValue = updateValue
    }
}

const ValuesContext = createContext(new Values([], () => {}, () => {}, () => {}))

export const ValuesProvider = (props) => {
    const { database } = useDatabase()

    const [values, setValues] = useState(null)
    const [valuesCollection, setValuesCollection] = useState(null)

    const [newValue, setNewValue] = useState({ date: currentDate, amount: 0 })

    useEffect(() => {
        if(database) {
            setValuesCollection(collection(database, 'values'))
        } else {
            setValuesCollection(null)
        }

    }, [database])

    useEffect(() => {
        if (valuesCollection) {
            console.log("full read values")
            getDocs(valuesCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

                    const valuesQueried = []

                    querySnapshot.forEach(doc => {
                        const data = doc.data()
                        data.id = doc.id

                        valuesQueried.push(data)
                    })

                    setValues(valuesQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setValues(null)
        }

    }, [valuesCollection])

    const addValue = () => {
        console.log("add", newValue)
        addDoc(valuesCollection, newValue).then(document => {
            newValue.id = document.id
        })
        setValues([newValue, ...values])
        setNewValue({ date: currentDate, amount: 0 })
    }

    const deleteValue = (value, index) => {
        console.log("delete", value)
        const updatedValues = [...values]
        updatedValues.splice(index, 1)
        setValues(updatedValues)

        deleteDoc(doc(valuesCollection, value.id))
    }

    const updateValue = (value, index) => {
        console.log("update", value)
        const updatedValues = [...values]
        updatedValues[index] = value
        setValues(updatedValues)

        const { id, ...newValue } = value

        setDoc(doc(valuesCollection, id), newValue)
    }

    return (
        <ValuesContext.Provider value={(new Values(values, addValue, deleteValue, updateValue))}>
            {props.children}
        </ValuesContext.Provider>
    )

}

export const useValues = () => {
    return useContext(ValuesContext)
}