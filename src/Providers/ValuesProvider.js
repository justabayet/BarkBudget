
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useScenario } from "./ScenarioProvider"

const currentDate = new Date()

class Values {
    constructor(values, addValue, deleteValue, updateValue) {
        this.values = values
        this.addValue = addValue
        this.deleteValue = deleteValue
        this.updateValue = updateValue
    }
}

class Value {
    constructor({ date, amount, id }) {
        this.date = date
        this.amount = amount
        this.id = id
    }
}

const ValuesContext = createContext(new Values([], () => {}, () => {}, () => {}))

const converter = {
    toFirestore(value) {
        console.log(value)
        return { date: getFormattedDate(value.date), amount: value.amount };
    },
    fromFirestore(snapshot, options) {
        const valueDb = snapshot.data()
        const date = new Date(valueDb.date)
        const amount = valueDb.amount
        const id = snapshot.id
        return new Value({ date, amount, id })
    }
}

export const ValuesProvider = (props) => {
    const { scenarioCollection } = useScenario()

    const [values, setValues] = useState(null)
    const [valuesCollection, setValuesCollection] = useState(null)

    const [newValue, setNewValue] = useState(new Value({ date: currentDate, amount: 0 }))

    useEffect(() => {
        if(scenarioCollection) {
            setValuesCollection(collection(scenarioCollection, 'values').withConverter(converter))
        } else {
            setValuesCollection(null)
        }

    }, [scenarioCollection])

    useEffect(() => {
        if (valuesCollection) {
            console.log("full read values")
            getDocs(valuesCollection)
                .then((querySnapshot) => {
                    console.log("Get", querySnapshot.size)

                    const valuesQueried = []

                    querySnapshot.forEach(doc => {
                        valuesQueried.push(converter.fromFirestore(doc))
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
        setNewValue(new Value({ date: currentDate, amount: 0 }))
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

        setDoc(doc(valuesCollection, value.id), value)
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