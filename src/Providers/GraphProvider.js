
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
    constructor(mainExpenses, setMainExpenses, mainValues, setMainValues, mainTargets, setMainTargets, pinnedScenarios, pinScenario, flushPinned) {
        this.mainExpenses = mainExpenses
        this.setMainExpenses = setMainExpenses

        this.mainValues = mainValues
        this.setMainValues = setMainValues

        this.mainTargets = mainTargets
        this.setMainTargets = setMainTargets

        this.pinnedScenarios = pinnedScenarios
        this.pinScenario = pinScenario
        this.flushPinned = flushPinned
    }
}

const GraphContext = createContext(new Graph(undefined, () => { }, undefined, () => { }, undefined, () => { }, undefined, () => { }))

export const GraphProvider = (props) => {
    const [pinnedScenarios, setPinnedScenarios] = useState([])

    const [mainExpenses, setMainExpenses] = useState([])
    const [mainValues, setMainValues] = useState([])
    const [mainTargets, setMainTargets] = useState([])

    const flushPinned = () => {
        console.log("flush pinned")
        setPinnedScenarios([])
    }

    const pinScenario = useRef(undefined)
    pinScenario.current = (scenario, data) => {
        setPinnedScenarios(pinnedScenarios => {
            const index = pinnedScenarios.findIndex((pinnedScenario) => pinnedScenario.scenario.id === scenario.id)
            if (index === -1) {
                console.log("GraphProvider tooglePinnedScenario", true)
                pinnedScenarios.push({ scenario, data })
            } else {
                console.log("GraphProvider tooglePinnedScenario", false)
                pinnedScenarios[index] = { scenario, data }
            }

            return [...pinnedScenarios]
        })
    }

    return (
        <GraphContext.Provider
            value={(new Graph(mainExpenses, setMainExpenses, mainValues, setMainValues, mainTargets, setMainTargets, pinnedScenarios, pinScenario, flushPinned))}
        >
            {props.children}
        </GraphContext.Provider>
    )

}

export const useGraph = () => {
    return useContext(GraphContext)
}