
import { doc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { ExpensesProvider } from "./GraphValuesProvider/ExpensesProvider"
import { LimitsProvider } from "./GraphValuesProvider/LimitsProvider"
import { useScenarios } from "./ScenariosProvider"
import { TargetsProvider } from "./GraphValuesProvider/TargetsProvider"
import { ValuesProvider } from "./GraphValuesProvider/ValuesProvider"

class Scenario {
    constructor(scenarioDoc, scenarioId, scenario) {
        this.scenarioDoc = scenarioDoc
        this.scenarioId = scenarioId
        this.scenario = scenario
    }
}

const ScenarioContext = createContext(new Scenario(undefined, undefined, undefined))

export const ScenarioProvider = (props) => {
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
        <ScenarioContext.Provider value={(new Scenario(scenarioDoc, scenarioId, scenario))}>
            <ValuesProvider>
                <ExpensesProvider>
                    <TargetsProvider>
                        <LimitsProvider>
                            {props.children}
                        </LimitsProvider>
                    </TargetsProvider>
                </ExpensesProvider>
            </ValuesProvider>
        </ScenarioContext.Provider>
    )
}

export const useScenario = () => {
    return useContext(ScenarioContext)
}