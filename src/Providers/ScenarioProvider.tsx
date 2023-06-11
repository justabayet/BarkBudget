
import { DocumentReference, doc } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { ExpensesProvider } from "./GraphValuesProvider/ExpensesProvider"
import { LimitsProvider } from "./GraphValuesProvider/LimitsProvider"
import { ValuesProvider } from "./GraphValuesProvider/ValuesProvider"
import { Scenario, useScenarios } from "./ScenariosProvider"

class ScenarioDocumented {
    scenario: Scenario
    scenarioDoc: DocumentReference | null

    constructor(scenarioDoc: DocumentReference | null, scenario: Scenario) {
        this.scenarioDoc = scenarioDoc
        this.scenario = scenario
    }
}

const ScenarioContext = createContext(new ScenarioDocumented(null, new Scenario({ name: "Init Scenario" })))

interface ScenarioProviderProps {
    scenario: Scenario
}

export const ScenarioProvider = React.memo(({ scenario, children }: React.PropsWithChildren<ScenarioProviderProps>): JSX.Element => {
    const scenarioId = scenario.id

    const { scenariosCollection } = useScenarios()

    const [scenarioDoc, setScenarioDoc] = useState<DocumentReference | null>(null)

    useEffect(() => {
        if (scenariosCollection && scenarioId) {
            console.log("ScenarioProvider setScenarioDoc:", scenarioId)
            setScenarioDoc(doc(scenariosCollection, scenarioId))
        } else {
            setScenarioDoc(null)
        }
    }, [scenariosCollection, scenarioId])

    return (
        <ScenarioContext.Provider value={(new ScenarioDocumented(scenarioDoc, scenario))}>
            <ValuesProvider>
                <ExpensesProvider>
                    <LimitsProvider>
                        {children}
                    </LimitsProvider>
                </ExpensesProvider>
            </ValuesProvider>
        </ScenarioContext.Provider>
    )
})

export const useScenario = () => {
    return useContext(ScenarioContext)
}