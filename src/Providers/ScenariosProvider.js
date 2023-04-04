
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useAuthentication } from "./AuthenticationProvider"

class Scenarios {
    constructor(scenarios, scenariosCollection, scenarioId, setScenarioId, addScenario, deleteScenario, updateScenario) {
        this.scenarios = scenarios
        this.scenariosCollection = scenariosCollection

        this.scenarioId = scenarioId
        this.currentScenario = null
        if (scenarios) {
            this.currentScenario = scenarios.find(scenario => this.scenarioId === scenario.id)
        }
        this.setScenarioId = setScenarioId

        this.addScenario = addScenario
        this.deleteScenario = deleteScenario
        this.updateScenario = updateScenario
    }
}

class Scenario {
    constructor({ copyId, startDate, endDate, startAmount = 0, id, name, isPinned = false }) {
        this.copyId = copyId
        this.startDate = startDate
        this.endDate = endDate
        this.startAmount = startAmount
        this.name = name
        this.id = id
        this.isPinned = isPinned


        if (this.startDate === undefined || isNaN(this.startDate)) {
            this.startDate = new Date()
        }

        if (this.endDate === undefined || isNaN(this.endDate)) {
            this.endDate = new Date(this.startDate)
            this.endDate.setFullYear(this.startDate.getFullYear() + 1)
        }

        if (isNaN(this.startAmount)) {
            this.startAmount = 0
        }

        if (this.copyId === undefined) {
            // TODO check copyId is valid
            this.copyId = null
        }
    }
}

const ScenariosContext = createContext(new Scenarios([], undefined, undefined, undefined, () => { }, () => { }, () => { }, () => { }))

const converter = {
    toFirestore(scenario) {
        console.log(scenario)
        return {
            startDate: getFormattedDate(scenario.startDate),
            endDate: getFormattedDate(scenario.endDate),
            startAmount: scenario.startAmount,
            copyId: scenario.copyId,
            name: scenario.name,
            isPinned: scenario.isPinned
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
        const isPinned = scenarioDb.isPinned

        return new Scenario({ copyId, startDate, endDate, startAmount, id, name, isPinned })
    }
}


export const ScenariosProvider = (props) => {
    const { userDoc } = useAuthentication()

    const [scenariosCollection, setScenariosCollection] = useState(null)
    const [scenarios, setScenarios] = useState(null)

    const [scenarioId, setScenarioId] = useState(null)

    useEffect(() => {
        // TODO might loop indefinitily if scenarios is undefined
        if (!scenarios || scenarios.length === 0) {
            setScenarioId(null)

        } else if (scenarioId === null) {
            setScenarioId(scenarios[0].id)
        }
    }, [scenarios, scenarioId])

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
            setScenarios(null)
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

        deleteDoc(doc(scenariosCollection, scenario.id)).then(() => setScenarioId(null))
    }

    const updateScenario = (scenario, index) => {
        console.log("update", scenario)
        const updatedScenarios = [...scenarios]
        updatedScenarios[index] = scenario
        setScenarios(updatedScenarios)

        setDoc(doc(scenariosCollection, scenario.id), scenario)
    }

    return (
        <ScenariosContext.Provider value={(new Scenarios(scenarios, scenariosCollection, scenarioId, setScenarioId, addScenario, deleteScenario, updateScenario))}>
            {props.children}
        </ScenariosContext.Provider>
    )
}

export const useScenarios = () => {
    return useContext(ScenariosContext)
}