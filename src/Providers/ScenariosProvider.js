
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useUserDoc } from "./UserDocProvider"

class Scenarios {
    constructor(scenarios, scenariosCollection, currentScenario, setScenarioIndex, addScenario, deleteScenario, updateScenario) {
        this.scenarios = scenarios
        this.scenariosCollection = scenariosCollection

        this.currentScenario = currentScenario
        this.setScenarioIndex = setScenarioIndex

        this.addScenario = addScenario
        this.deleteScenario = deleteScenario
        this.updateScenario = updateScenario
    }
}

class Scenario {
    constructor({ copyId, startDate, endDate, startAmount = 0, id, name }) {
        this.copyId = copyId
        this.startDate = startDate
        this.endDate = endDate
        this.startAmount = startAmount
        this.name = name
        this.id = id


        if (this.startDate === undefined || isNaN(this.startDate)) {
            this.startDate = new Date()
        }

        if (this.endDate === undefined || isNaN(this.endDate)) {
            this.endDate = new Date(this.startDate)
            this.endDate.setFullYear(this.startDate.getFullYear() + 1)
        }

        if (this.startAmount === undefined || isNaN(this.startAmount)) {
            this.startAmount = 0
        }

        if (this.copyId === undefined) {
            // TODO check copyId is valid
            this.copyId = null
        }
    }
}

const ScenariosContext = createContext(new Scenarios([], undefined, undefined, () => { }, () => { }, () => { }, () => { }))

const converter = {
    toFirestore(scenario) {
        console.log(scenario)
        return {
            startDate: getFormattedDate(scenario.startDate),
            endDate: getFormattedDate(scenario.endDate),
            startAmount: scenario.startAmount,
            copyId: scenario.copyId,
            name: scenario.name
        };
    },
    fromFirestore(snapshot, options) {
        const scenarioDb = snapshot.data()
        const copyId = scenarioDb.copyId
        const startDate = new Date(scenarioDb.startDate)
        const endDate = new Date(scenarioDb.endDate)
        const startAmount = parseInt(scenarioDb.startAmount)
        const name = scenarioDb.name
        const id = snapshot.id

        return new Scenario({ copyId, startDate, endDate, startAmount, id, name })
    }
}

export const ScenariosProvider = (props) => {
    const { userDoc } = useUserDoc(null)

    const [scenariosCollection, setScenariosCollection] = useState(null)
    const [scenarios, setScenarios] = useState([])

    const [scenarioIndex, setScenarioIndex] = useState(null)

    useEffect(() => {
        if (scenarios.length === 0) {
            setScenarioIndex(null)

        } else if (scenarioIndex === null) {
            setScenarioIndex(0)
        }
    }, [scenarios.length, scenarioIndex])

    useEffect(() => {
        if (userDoc) {
            setScenariosCollection(collection(userDoc, 'scenarios').withConverter(converter))
        } else {
            setScenariosCollection(null)
        }
    }, [userDoc])

    useEffect(() => {
        if (scenariosCollection) {
            getDocs(scenariosCollection)
                .then((querySnapshot) => {
                    console.log("ScenariosProvider Full read get", querySnapshot.size)

                    const scenariosQueried = []
                    querySnapshot.forEach(doc => {
                        scenariosQueried.push(doc.data())
                    })

                    setScenarios(scenariosQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setScenarios([])
        }
    }, [scenariosCollection])

    const [newScenario, setNewScenario] = useState(new Scenario({ name: "New Scenario" }))

    const addScenario = () => {
        console.log("add", newScenario)
        addDoc(scenariosCollection, newScenario).then(document => {
            newScenario.id = document.id
        })
        setScenarios([newScenario, ...scenarios])
        setNewScenario(new Scenario({ name: "New Scenario" }))
    }

    const deleteScenario = (scenario, index) => {
        console.log("delete", scenario)
        const updatedScenarios = [...scenarios]
        updatedScenarios.splice(index, 1)
        setScenarios(updatedScenarios)

        deleteDoc(doc(scenariosCollection, scenario.id)).then(() => setScenarioIndex(null))
    }

    const updateScenario = (scenario, index) => {
        console.log("update", scenario)
        const updatedScenarios = [...scenarios]
        updatedScenarios[index] = scenario
        setScenarios(updatedScenarios)

        setDoc(doc(scenariosCollection, scenario.id), scenario)
    }

    return (
        <ScenariosContext.Provider value={(new Scenarios(scenarios, scenariosCollection, scenarios[scenarioIndex], setScenarioIndex, addScenario, deleteScenario, updateScenario))}>
            {props.children}
        </ScenariosContext.Provider>
    )
}

export const useScenarios = () => {
    return useContext(ScenariosContext)
}