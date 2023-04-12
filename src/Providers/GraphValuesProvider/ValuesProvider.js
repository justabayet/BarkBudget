
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../../helpers"
import { compareGraphValues } from "../GraphProvider"
import { useScenario } from "../ScenarioProvider"

const currentDate = new Date()

class Values {
    constructor(values, graphValues, addValue, deleteValue, updateValue) {
        this.values = values
        this.graphValues = graphValues
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

        if (this.date === undefined || isNaN(this.date)) {
            this.date = new Date()
        }

        if (isNaN(this.amount)) {
            this.amount = 0
        }
    }
}

const ValuesContext = createContext(new Values([], [], () => { }, () => { }, () => { }))

const converter = {
    toFirestore(value) {
        console.log(value)
        return { date: getFormattedDate(value.date), amount: value.amount };
    },
    fromFirestore(snapshot, options) {
        const valueDb = snapshot.data()
        const date = new Date(valueDb.date)
        const amount = parseInt(valueDb.amount)
        const id = snapshot.id
        return new Value({ date, amount, id })
    }
}

export const ValuesProvider = (props) => {
    const { scenarioDoc, scenario } = useScenario()
    const { startDate, endDate } = scenario

    const [values, setValues] = useState(null)
    const [graphValues, setGraphValues] = useState([])
    const [valuesCollection, setValuesCollection] = useState(null)

    const [newValue, setNewValue] = useState(new Value({ date: currentDate, amount: 0 }))

    useEffect(() => {
        if (scenarioDoc) {
            setValuesCollection(collection(scenarioDoc, 'values').withConverter(converter))
        } else {
            setValuesCollection(null)
        }

    }, [scenarioDoc])

    useEffect(() => {
        if (valuesCollection) {
            getDocs(valuesCollection)
                .then((querySnapshot) => {
                    console.log("ValuesProvider Full read get", querySnapshot.size)

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
            setValues([newValue, ...values])
            setNewValue(new Value({ date: currentDate, amount: 0 }))
        })
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


    useEffect(() => {
        if (values === null) return

        console.log("ValuesProvider compute graph values:", startDate.toLocaleDateString("en-US"), endDate.toLocaleDateString("en-US"), values?.length)
        const updatedGraphValues = []

        values?.forEach(value => {
            if (value.date >= startDate && value.date <= endDate) {
                updatedGraphValues.push({
                    x: new Date(value.date),
                    y: value.amount,
                })
            }
        })

        updatedGraphValues.sort(compareGraphValues)
        setGraphValues(updatedGraphValues)
    }, [values, startDate, endDate])

    return (
        <ValuesContext.Provider value={(new Values(values, graphValues, addValue, deleteValue, updateValue))}>
            {props.children}
        </ValuesContext.Provider>
    )

}

export const useValues = () => {
    return useContext(ValuesContext)
}