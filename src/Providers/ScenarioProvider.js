
import { doc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { ExpensesProvider } from "./ExpensesProvider"
import { LimitsProvider } from "./LimitsProvider"
import { useScenarios } from "./ScenariosProvider"
import { TargetsProvider } from "./TargetsProvider"
import { ValuesProvider } from "./ValuesProvider"

class Scenario {
    constructor(scenarioDoc) {
        this.scenarioDoc = scenarioDoc
    }
}

const ScenarioContext = createContext(new Scenario([], [], []))

export const ScenarioProvider = (props) => {
    const scenarioId = props.id
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
        <ScenarioContext.Provider value={(new Scenario(scenarioDoc))}>
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