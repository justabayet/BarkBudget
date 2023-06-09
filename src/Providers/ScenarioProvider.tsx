import React, { createContext, useContext, useEffect, useState } from 'react'

import { DocumentReference, doc } from 'firebase/firestore'

import { ExpectationsProvider, LimitsProvider, RecordsProvider } from 'Providers/GraphValuesProvider'
import { Scenario, useScenarios } from 'Providers/ScenariosProvider'

class ScenarioDocumented {
    constructor(public scenarioDoc: DocumentReference | null, public scenario: Scenario) { }
}

const ScenarioContext = createContext(new ScenarioDocumented(null, new Scenario({ name: 'Init Scenario' })))

interface ScenarioProviderProps {
    scenario: Scenario
}

export const ScenarioProvider = React.memo(({ scenario, children }: React.PropsWithChildren<ScenarioProviderProps>): JSX.Element => {
    const scenarioId = scenario.id

    const { scenariosCollection } = useScenarios()

    const [scenarioDoc, setScenarioDoc] = useState<DocumentReference | null>(null)

    useEffect(() => {
        if (scenariosCollection && scenarioId) {
            console.log('ScenarioProvider setScenarioDoc:', scenarioId)
            setScenarioDoc(doc(scenariosCollection, scenarioId))
        } else {
            setScenarioDoc(null)
        }
    }, [scenariosCollection, scenarioId])

    return (
        <ScenarioContext.Provider value={(new ScenarioDocumented(scenarioDoc, scenario))}>
            <RecordsProvider>
                <ExpectationsProvider>
                    <LimitsProvider>
                        {children}
                    </LimitsProvider>
                </ExpectationsProvider>
            </RecordsProvider>
        </ScenarioContext.Provider>
    )
})

export const useScenario = () => {
    return useContext(ScenarioContext)
}