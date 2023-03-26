
import { collection, getDocs } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { getFormattedDate } from "../helpers"
import { useUserDoc } from "./UserDocProvider"

class Scenarios {
    constructor(scenarios, scenariosCollection) {
        this.scenarios = scenarios
        this.scenariosCollection = scenariosCollection
    }
}

class Scenario {
    constructor({ copyId, startDate, endDate, startAmount = 0, id, name }) {
        this.copyId = copyId
        this.startDate = startDate
        this.endDate = endDate
        this.startAmount = startAmount
        this.name = name
        this.id = id
    }
}

const ScenariosContext = createContext(new Scenarios([]))

const converter = {
    toFirestore(scenario) {
        console.log(scenario)
        return {
            startDate: getFormattedDate(scenario.startDate),
            endDate: getFormattedDate(scenario.endDate),
            startAmount: scenario.startAmount,
            copyId: scenario.copyId,
            name: scenario.name
        };
    },
    fromFirestore(snapshot, options) {
        const scenarioDb = snapshot.data()
        const copyId = scenarioDb.copyId
        let startDate = new Date(scenarioDb.startDate)
        let endDate = new Date(scenarioDb.endDate)
        let startAmount = parseInt(scenarioDb.startAmount)
        let name = scenarioDb.name
        const id = snapshot.id

        if (scenarioDb.startDate === undefined || startDate === "Invalid date") {
            startDate = new Date()
        }

        if (scenarioDb.endDate === undefined || endDate === "Invalid date") {
            endDate = new Date(startDate)
            endDate.setFullYear(startDate.getFullYear() + 1)
        }

        if (isNaN(startAmount)) {
            startAmount = 0
        }

        // TODO check copyId is valid

        return new Scenario({ copyId, startDate, endDate, startAmount, id, name })
    }
}

export const ScenariosProvider = (props) => {
    const { userDoc } = useUserDoc(null)

    const [scenariosCollection, setScenariosCollection] = useState(null)
    const [scenarios, setScenarios] = useState([])

    useEffect(() => {
        if (userDoc) {
            setScenariosCollection(collection(userDoc, 'scenarios').withConverter(converter))
        } else {
            setScenariosCollection(null)
        }
    }, [userDoc])

    useEffect(() => {
        if (scenariosCollection) {
            console.log("ScenariosProvider: full read")
            getDocs(scenariosCollection)
                .then((querySnapshot) => {
                    console.log("ScenariosProvider get:", querySnapshot.size)

                    const scenariosQueried = []
                    querySnapshot.forEach(doc => {
                        scenariosQueried.push(doc.data())
                    })
                    console.log(scenariosQueried)

                    setScenarios(scenariosQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setScenarios([])
        }
    }, [scenariosCollection])

    return (
        <ScenariosContext.Provider value={(new Scenarios(scenarios, scenariosCollection))}>
            {props.children}
        </ScenariosContext.Provider>
    )
}

export const useScenarios = () => {
    return useContext(ScenariosContext)
}