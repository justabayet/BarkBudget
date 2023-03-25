
import { collection, doc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { ExpensesProvider } from "./ExpensesProvider"
import { LimitsProvider } from "./LimitsProvider"
import { useScenarios } from "./ScenariosProvider"
import { TargetsProvider } from "./TargetsProvider"
import { useDatabase } from "./UserDocProvider"
import { ValuesProvider } from "./ValuesProvider"

class Scenario {
    constructor(scenarioCollection) {
        this.scenarioCollection = scenarioCollection
    }
}

const ScenarioContext = createContext(new Scenario([], [], []))

export const ScenarioProvider = (props) => {
    const scenarioId = props.id
    const { scenariosCollection } = useScenarios()

    const [scenarioCollection, setScenarioCollection] = useState(null)

    useEffect(() => {
        if (scenariosCollection && scenarioId) {
            setScenarioCollection(doc(scenariosCollection, scenarioId))
        } else {
            setScenarioCollection(null)
        }
    }, [scenariosCollection, scenarioId])

    return (
        <ScenarioContext.Provider value={(new Scenario(scenarioCollection))}>
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