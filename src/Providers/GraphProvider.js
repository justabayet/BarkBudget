
import { createContext, useContext, useRef, useState } from "react"

export function compareGraphValues(a, b) {
    if (a.x < b.x) {
        return -1
    }
    if (a.x > b.x) {
        return 1
    }
    return 0
}

class Graph {
    constructor(mainExpenses, setMainExpenses, mainValues, setMainValues, mainTargets, setMainTargets, pinnedScenarios, pinScenario, unpinScenario) {
        this.mainExpenses = mainExpenses
        this.setMainExpenses = setMainExpenses

        this.mainValues = mainValues
        this.setMainValues = setMainValues

        this.mainTargets = mainTargets
        this.setMainTargets = setMainTargets

        this.pinnedScenarios = pinnedScenarios
        this.pinScenario = pinScenario
        this.unpinScenario = unpinScenario
    }
}

const GraphContext = createContext(new Graph(undefined, () => { }, undefined, () => { }, undefined, () => { }, undefined, () => { }, () => { }))

export const GraphProvider = (props) => {
    const [pinnedScenarios, setPinnedScenarios] = useState([])

    const [mainExpenses, setMainExpenses] = useState([])
    const [mainValues, setMainValues] = useState([])
    const [mainTargets, setMainTargets] = useState([])

    const pinScenario = useRef(undefined)
    pinScenario.current = (scenario, data) => {
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

    const unpinScenario = useRef(undefined)
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
            value={(new Graph(mainExpenses, setMainExpenses, mainValues, setMainValues, mainTargets, setMainTargets, pinnedScenarios, pinScenario, unpinScenario))}
        >
            {props.children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}