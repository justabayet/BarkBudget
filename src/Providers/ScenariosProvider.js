
import { collection, getDocs } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useUserDoc } from "./UserDocProvider"

class Scenarios {
    constructor(scenarioIds, scenariosCollection) {
        this.scenarioIds = scenarioIds
        this.scenariosCollection = scenariosCollection
    }
}

const ScenariosContext = createContext(new Scenarios([]))

export const ScenariosProvider = (props) => {
    const { userDoc } = useUserDoc(null)

    const [scenariosCollection, setScenariosCollection] = useState(null)
    const [scenarioIds, setScenariosId] = useState([])

    useEffect(() => {
        if (userDoc) {
            setScenariosCollection(collection(userDoc, 'scenarios'))
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

                    const scenarioIdsQueried = []
                    querySnapshot.forEach(doc => {
                        scenarioIdsQueried.push(doc.id)
                    })

                    setScenariosId(scenarioIdsQueried)
                })
                .catch(reason => console.log(reason))
        } else {
            setScenariosId([])
        }
    }, [scenariosCollection])

    return (
        <ScenariosContext.Provider value={(new Scenarios(scenarioIds, scenariosCollection))}>
            {props.children}
        </ScenariosContext.Provider>
    )
}

export const useScenarios = () => {
    return useContext(ScenariosContext)
}