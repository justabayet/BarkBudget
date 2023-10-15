import React, { createContext, useContext, useMemo, useRef, useState } from 'react'

import { Scenario } from 'Providers/ScenariosProvider'

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
    constructor(
        public mainExpectations: GraphValue[],
        public setMainExpectations: (newMainExpectations: GraphValue[]) => void,
        public mainRecords: GraphValue[],
        public setMainRecords: (newMainRecords: GraphValue[]) => void,
        public mainLimits: GraphValue[],
        public setMainLimits: (newMainLimits: GraphValue[]) => void,
        public pinnedScenarios: PinnedScenario[],
        public pinScenario: React.MutableRefObject<((scenario: Scenario, data: GraphValue[]) => void)> | undefined,
        public unpinScenario: React.MutableRefObject<((scenario: Scenario) => void)> | undefined) { }
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

    const pinScenario = useRef<(scenario: Scenario, data: GraphValue[]) => void>(() => { })
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

    const unpinScenario = useRef<(scenario: Scenario) => void>(() => { })
    unpinScenario.current = (scenario) => {
        setPinnedScenarios(pinnedScenarios => {
            const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
            if (index !== -1) pinnedScenarios.splice(index, 1)

            return [...pinnedScenarios]
        })
    }

    const value = useMemo(
        () => new Graph(mainExpectations, setMainExpectations, mainRecords, setMainRecords, mainLimits, setMainLimits, pinnedScenarios, pinScenario, unpinScenario),
        [mainExpectations, mainLimits, mainRecords, pinnedScenarios]
    )

    return (
        <GraphContext.Provider
            value={value}
        >
            {children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}