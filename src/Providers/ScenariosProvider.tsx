
import { CollectionReference, FirestoreDataConverter, collection, doc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useAuthentication } from "./AuthenticationProvider"
import { useFirebaseRepository } from "./FirebaseRepositoryProvider"
import { useLoadingStatus } from "./LoadingStatusProvider"

class Scenarios {
    currentScenario?: Scenario | null

    constructor(
        public scenarios: Scenario[] | null,
        public scenariosCollection: CollectionReference | null,
        public scenarioId: string | null | undefined,
        public setScenarioId: (newScenarioId: string | null) => void,
        public addScenario: () => void,
        public deleteScenario: (scenario: Scenario, index: number) => void,
        public updateScenario: (scenario: Scenario, index: number) => void) {

        this.currentScenario = null
        if (scenarios) {
            this.currentScenario = scenarios.find(scenario => this.scenarioId === scenario.id)
        }
    }
}

interface ScenarioParameter {
    startDate?: Date
    endDate?: Date
    id?: string
    name: string
    isPinned?: boolean
}

export class Scenario {
    startDate: Date
    endDate: Date
    id?: string
    name: string
    isPinned: boolean

    constructor({ startDate, endDate, id, name, isPinned = false }: ScenarioParameter) {
        this.name = name
        this.id = id
        this.isPinned = isPinned

        if (startDate === undefined || isNaN(startDate.getTime())) {
            this.startDate = new Date()
        } else {
            this.startDate = startDate
        }

        if (endDate === undefined || isNaN(endDate.getTime())) {
            this.endDate = new Date(this.startDate)
            this.endDate.setFullYear(this.startDate.getFullYear() + 1)
        } else {
            this.endDate = endDate
        }
    }
}

const ScenariosContext = createContext(new Scenarios([], null, null, () => { }, () => { }, () => { }, () => { }))

interface ScenarioFirestore {
    startDate: string,
    endDate: string,
    name: string,
    isPinned: string
}

const converter: FirestoreDataConverter<Scenario> = {
    toFirestore(scenario: Scenario): ScenarioFirestore {
        return {
            startDate: getFormattedDate(scenario.startDate),
            endDate: getFormattedDate(scenario.endDate),
            name: scenario.name,
            isPinned: String(scenario.isPinned)
        }
    },
    fromFirestore(snapshot: any, options?: any): Scenario {
        const scenarioDb: ScenarioFirestore = snapshot.data()
        const startDate = new Date(scenarioDb.startDate)
        const endDate = new Date(scenarioDb.endDate)
        const name = scenarioDb.name
        const id = snapshot.id
        const isPinned = scenarioDb.isPinned === 'true'

        return new Scenario({ startDate, endDate, id, name, isPinned })
    }
}

const updateDuplicatedName = (newScenario: Scenario, scenarios: Scenario[]) => {
    const duplicatedName = scenarios.filter(scenario => scenario.name === newScenario.name).length

    if (duplicatedName > 0) newScenario.name += ` ${duplicatedName}`
}


export const ScenariosProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { userDoc } = useAuthentication()
    const { addDoc, setDoc, deleteScenarioFirestore } = useFirebaseRepository()

    const [scenarios, setScenarios] = useState<Scenario[] | null>(null)
    const [scenariosCollection, setScenariosCollection] = useState<CollectionReference | null>(null)

    const [scenarioId, setScenarioId] = useState<string | null | undefined>(null)

    const [_scenariosLoading, _setScenariosLoading] = useState<boolean>(true)
    const { setScenariosLoading } = useLoadingStatus()

    useEffect(() => {
        setScenariosLoading(_scenariosLoading)
    }, [_scenariosLoading, setScenariosLoading])

    useEffect(() => {
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
            _setScenariosLoading(true)
            getDocs(scenariosCollection)
                .then((querySnapshot) => {
                    console.log("ScenariosProvider Full read get", querySnapshot.size)

                    const scenariosQueried: Scenario[] = []
                    querySnapshot.forEach(doc => {
                        scenariosQueried.push(converter.fromFirestore(doc))
                    })

                    setScenarios(scenariosQueried)
                })
                .catch(reason => console.log(reason))
                .finally(() => {
                    _setScenariosLoading(false)
                })
        } else {
            setScenarios(null)
        }
    }, [scenariosCollection])

    const [newScenario, setNewScenario] = useState(new Scenario({ name: "New Scenario" }))

    const addScenario = () => {
        console.log("add", newScenario)

        if (scenariosCollection === null || scenarios === null) {
            return
        }

        updateDuplicatedName(newScenario, scenarios)

        addDoc(scenariosCollection, newScenario).then(document => {
            newScenario.id = document.id
            setScenarios([newScenario, ...scenarios])
            setScenarioId(newScenario.id)
            setNewScenario(new Scenario({ name: "New Scenario" }))
        })
    }

    const deleteScenario = (scenario: Scenario, index: number): void => {
        console.log("delete", scenario)

        if (scenariosCollection === null || scenarios === null) {
            return
        }

        const updatedScenarios = [...scenarios]
        updatedScenarios.splice(index, 1)
        setScenarios(updatedScenarios)
        if (updatedScenarios.length > 0) {
            setScenarioId(updatedScenarios[0].id)
        } else {
            setScenarioId(null)
        }

        if (scenario.id) deleteScenarioFirestore(scenariosCollection, scenario.id)
    }

    const updateScenario = (scenario: Scenario, index: number): void => {
        console.log("update", scenario)

        if (scenariosCollection === null || scenarios === null) {
            return
        }

        updateDuplicatedName(scenario, scenarios)

        const updatedScenarios = [...scenarios]
        updatedScenarios[index] = scenario
        setScenarios(updatedScenarios)

        setDoc(doc(scenariosCollection, scenario.id), scenario)
    }

    return (
        <ScenariosContext.Provider value={(new Scenarios(scenarios, scenariosCollection, scenarioId, setScenarioId, addScenario, deleteScenario, updateScenario))}>
            {children}
        </ScenariosContext.Provider>
    )
}

export const useScenarios = () => {
    return useContext(ScenariosContext)
}