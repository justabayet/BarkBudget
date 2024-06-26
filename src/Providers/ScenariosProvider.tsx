
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { CollectionReference, FirestoreDataConverter, collection, doc, getDocs } from 'firebase/firestore'

import { getFormattedDate } from 'helpers'

import { useAuthentication } from './AuthenticationProvider'
import { useFirebaseRepository } from './FirebaseRepositoryProvider'
import { useLoadingStatus } from './LoadingStatusProvider'

class Scenarios {
    currentScenario?: Scenario | null

    constructor(
        public scenarios: Scenario[] | null,
        public scenariosCollection: CollectionReference | null,
        public scenarioId: string | null | undefined,
        public setScenarioId: (newScenarioId: string | null) => void,
        public addScenario: () => void,
        public deleteScenario: (scenario: Scenario, index: number) => void,
        public updateScenario: (scenario: Scenario, index: number) => void,
        public cloneScenario: (scenario: Scenario) => void) {

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

const ScenariosContext = createContext(new Scenarios([], null, null, () => { }, () => { }, () => { }, () => { }, () => { }))

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
        const startDate = new Date(scenarioDb.startDate.replace(/-/g, "/"))
        const endDate = new Date(scenarioDb.endDate.replace(/-/g, "/"))
        const name = scenarioDb.name
        const id = snapshot.id
        const isPinned = scenarioDb.isPinned === 'true'

        return new Scenario({ startDate, endDate, id, name, isPinned })
    }
}


export const ScenariosProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const { userDoc, user } = useAuthentication()
    const { addDoc, setDoc, deleteScenarioFirestore, cloneScenarioFirestore } = useFirebaseRepository()

    const [scenarios, setScenarios] = useState<Scenario[] | null>(null)
    const [scenariosCollection, setScenariosCollection] = useState<CollectionReference<Scenario> | null>(null)

    const [scenarioId, setScenarioId] = useState<string | null | undefined>(null)

    const [internalScenariosLoading, setInternalScenariosLoading] = useState<boolean>(true)
    const { setScenariosLoading } = useLoadingStatus()

    useEffect(() => {
        setScenariosLoading(internalScenariosLoading)
    }, [internalScenariosLoading, setScenariosLoading])

    useEffect(() => {
        if (!!scenarioId && userDoc) {
            setDoc(userDoc, { scenarioId })
        }
    }, [scenarioId, userDoc, setDoc])

    useEffect(() => {
        if (!scenarios || scenarios.length === 0) {
            setScenarioId(null)
        } else if (scenarioId === null) {
            let defaultScenarioId = scenarios.findIndex(({ id }) => id === user?.scenarioId)
            defaultScenarioId = defaultScenarioId !== -1 ? defaultScenarioId : 0

            setScenarioId(scenarios[defaultScenarioId].id)
        }
    }, [scenarios, scenarioId, user])

    useEffect(() => {
        if (userDoc) {
            setScenariosCollection(collection(userDoc, 'scenarios').withConverter(converter))
        } else {
            setScenariosCollection(null)
        }
    }, [userDoc])

    useEffect(() => {
        if (scenariosCollection) {
            setInternalScenariosLoading(true)
            getDocs(scenariosCollection)
                .then((querySnapshot) => {
                    const scenariosQueried: Scenario[] = []
                    querySnapshot.forEach(doc => {
                        scenariosQueried.push(doc.data())
                    })

                    setScenarios(scenariosQueried)
                })
                .catch(reason => console.log(reason))
                .finally(() => {
                    setInternalScenariosLoading(false)
                })
        } else {
            setScenarios(null)
        }
    }, [scenariosCollection])

    const [newScenario, setNewScenario] = useState(new Scenario({ name: 'New Scenario' }))

    const addScenario = useCallback(() => {
        console.log('add', newScenario)

        if (scenariosCollection === null || scenarios === null) {
            return
        }

        addDoc(scenariosCollection, newScenario).then(document => {
            newScenario.id = document.id
            setScenarios([newScenario, ...scenarios])
            setScenarioId(newScenario.id)
            setNewScenario(new Scenario({ name: 'New Scenario' }))
        })
    }, [addDoc, newScenario, scenarios, scenariosCollection])

    const cloneScenario = useCallback((scenario: Scenario) => {
        console.log('clone')

        if (scenariosCollection === null || scenarios === null) {
            return
        }

        if (scenario.id == null) {
            console.log('Source scenario id not initialized yet', scenario)
            return
        }

        const clonedScenario = new Scenario({
            startDate: scenario.startDate,
            endDate: scenario.endDate,
            name: `Copy of ${scenario.name}`,
        })

        addDoc(scenariosCollection, clonedScenario).then(async (document) => {
            await cloneScenarioFirestore(scenariosCollection, scenario.id!, document.id)
            clonedScenario.id = document.id
            setScenarios([clonedScenario, ...scenarios])
            setScenarioId(clonedScenario.id)
        })
    }, [addDoc, cloneScenarioFirestore, scenarios, scenariosCollection])

    const deleteScenario = useCallback((scenario: Scenario, index: number): void => {
        console.log('delete', scenario)

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
    }, [deleteScenarioFirestore, scenarios, scenariosCollection])

    const updateScenario = useCallback((scenario: Scenario, index: number): void => {
        console.log('update', scenario)

        if (scenariosCollection === null || scenarios === null) {
            return
        }

        const updatedScenarios = [...scenarios]
        updatedScenarios[index] = scenario
        setScenarios(updatedScenarios)

        setDoc(doc(scenariosCollection, scenario.id), scenario)
    }, [scenarios, scenariosCollection, setDoc])

    const value = useMemo(() => {
        return new Scenarios(scenarios, scenariosCollection, scenarioId, setScenarioId, addScenario, deleteScenario, updateScenario, cloneScenario)
    }, [scenarios, scenariosCollection, scenarioId, addScenario, deleteScenario, updateScenario, cloneScenario])

    return (
        <ScenariosContext.Provider value={value}>
            {children}
        </ScenariosContext.Provider>
    )
}

export const useScenarios = () => {
    return useContext(ScenariosContext)
}