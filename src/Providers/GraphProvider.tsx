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
    mainExpectations: GraphValue[]
    setMainExpectations: (newMainExpectations: GraphValue[]) => void
    mainRecords: GraphValue[]
    setMainRecords: (newMainRecords: GraphValue[]) => void
    mainLimits: GraphValue[]
    setMainLimits: (newMainLimits: GraphValue[]) => void
    pinnedScenarios: PinnedScenario[]
    pinScenario: React.MutableRefObject<((scenario: Scenario, data: GraphValue[]) => void)> | undefined
    unpinScenario: React.MutableRefObject<((scenario: Scenario) => void)> | undefined

    constructor(
        mainExpectations: GraphValue[],
        setMainExpectations: (newMainExpectations: GraphValue[]) => void,
        mainRecords: GraphValue[],
        setMainRecords: (newMainRecords: GraphValue[]) => void,
        mainLimits: GraphValue[],
        setMainLimits: (newMainLimits: GraphValue[]) => void,
        pinnedScenarios: PinnedScenario[],
        pinScenario: React.MutableRefObject<((scenario: Scenario, data: GraphValue[]) => void)> | undefined,
        unpinScenario: React.MutableRefObject<((scenario: Scenario) => void)> | undefined) {

        this.mainExpectations = mainExpectations
        this.setMainExpectations = setMainExpectations

        this.mainRecords = mainRecords
        this.setMainRecords = setMainRecords

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

    const [mainExpectations, setMainExpectations] = useState<GraphValue[]>([])
    const [mainRecords, setMainRecords] = useState<GraphValue[]>([])
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
            value={(new Graph(mainExpectations, setMainExpectations, mainRecords, setMainRecords, mainLimits, setMainLimits, pinnedScenarios, pinScenario, unpinScenario))}
        >
            {children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}