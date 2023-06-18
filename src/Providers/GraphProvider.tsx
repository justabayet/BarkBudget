import React, { createContext, useContext, useRef, useState } from "react"
import { Scenario } from "./ScenariosProvider"

export function compareGraphValues(a: GraphValue, b: GraphValue): number {
    if (a.x < b.x) {
        return -1
    }
    if (a.x > b.x) {
        return 1
    }
    return 0
}

export interface GraphValue {
    x: Date
    y: number
}

class Graph {
    mainExpenses: GraphValue[]
    setMainExpenses: (newMainExpenses: GraphValue[]) => void
    mainValues: GraphValue[]
    setMainValues: (newMainValues: GraphValue[]) => void
    mainLimits: GraphValue[]
    setMainLimits: (newMainLimits: GraphValue[]) => void
    pinnedScenarios: PinnedScenario[]
    pinScenario: React.MutableRefObject<((scenario: Scenario, data: GraphValue[]) => void)> | undefined
    unpinScenario: React.MutableRefObject<((scenario: Scenario) => void)> | undefined

    constructor(
        mainExpenses: GraphValue[],
        setMainExpenses: (newMainExpenses: GraphValue[]) => void,
        mainValues: GraphValue[],
        setMainValues: (newMainValues: GraphValue[]) => void,
        mainLimits: GraphValue[],
        setMainLimits: (newMainLimits: GraphValue[]) => void,
        pinnedScenarios: PinnedScenario[],
        pinScenario: React.MutableRefObject<((scenario: Scenario, data: GraphValue[]) => void)> | undefined,
        unpinScenario: React.MutableRefObject<((scenario: Scenario) => void)> | undefined) {

        this.mainExpenses = mainExpenses
        this.setMainExpenses = setMainExpenses

        this.mainValues = mainValues
        this.setMainValues = setMainValues

        this.mainLimits = mainLimits
        this.setMainLimits = setMainLimits

        this.pinnedScenarios = pinnedScenarios
        this.pinScenario = pinScenario
        this.unpinScenario = unpinScenario
    }
}

interface PinnedScenario {
    scenario: Scenario
    data: GraphValue[]
}

const GraphContext = createContext(new Graph([], () => { }, [], () => { }, [], () => { }, [], undefined, undefined))

export const GraphProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [pinnedScenarios, setPinnedScenarios] = useState<PinnedScenario[]>([])

    const [mainExpenses, setMainExpenses] = useState<GraphValue[]>([])
    const [mainValues, setMainValues] = useState<GraphValue[]>([])
    const [mainLimits, setMainLimits] = useState<GraphValue[]>([])

    const pinScenario = useRef<((scenario: Scenario, data: GraphValue[]) => void) | (() => void)>(() => { })
    pinScenario.current = (scenario: Scenario, data: GraphValue[]): void => {
        setPinnedScenarios(pinnedScenarios => {
            const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
            if (index === -1) {
                pinnedScenarios.push({ scenario, data })
            } else {
                pinnedScenarios[index] = { scenario, data }
            }

            return [...pinnedScenarios]
        })
    }

    const unpinScenario = useRef<((scenario: Scenario) => void) | (() => void)>(() => { })
    unpinScenario.current = (scenario) => {
        setPinnedScenarios(pinnedScenarios => {
            const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
            if (index !== -1) {
                pinnedScenarios.splice(index, 1)
            }
            return [...pinnedScenarios]
        })
    }

    return (
        <GraphContext.Provider
            value={(new Graph(mainExpenses, setMainExpenses, mainValues, setMainValues, mainLimits, setMainLimits, pinnedScenarios, pinScenario, unpinScenario))}
        >
            {children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}