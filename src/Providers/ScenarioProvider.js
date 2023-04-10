
import { doc } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import { ExpensesProvider } from "./GraphValuesProvider/ExpensesProvider"
import { LimitsProvider } from "./GraphValuesProvider/LimitsProvider"
import { useScenarios } from "./ScenariosProvider"
import { ValuesProvider } from "./GraphValuesProvider/ValuesProvider"

class Scenario {
    constructor(scenarioDoc, scenario) {
        this.scenarioDoc = scenarioDoc
        this.scenario = scenario
    }
}

const ScenarioContext = createContext(new Scenario(undefined, undefined, undefined))

export const ScenarioProvider = React.memo((props) => {
    const scenario = props.scenario
    const scenarioId = scenario.id

    const { scenariosCollection } = useScenarios()

    const [scenarioDoc, setScenarioDoc] = useState(null)

    useEffect(() => {
        if (scenariosCollection && scenarioId) {
            console.log("ScenarioProvider setScenarioDoc:", scenarioId)
            setScenarioDoc(doc(scenariosCollection, scenarioId))
        } else {
            setScenarioDoc(null)
        }
    }, [scenariosCollection, scenarioId])

    return (
        <ScenarioContext.Provider value={(new Scenario(scenarioDoc, scenario))}>
            <ValuesProvider>
                <ExpensesProvider>
                    <LimitsProvider>
                        {props.children}
                    </LimitsProvider>
                </ExpensesProvider>
            </ValuesProvider>
        </ScenarioContext.Provider>
    )
})

export const useScenario = () => {
    return useContext(ScenarioContext)
}