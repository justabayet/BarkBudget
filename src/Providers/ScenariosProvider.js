
import { collection, getDocs } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useUserDoc } from "./UserDocProvider"

class Scenarios {
    constructor(scenarios, scenariosCollection) {
        this.scenarios = scenarios
        this.scenariosCollection = scenariosCollection
    }
}

const ScenariosContext = createContext(new Scenarios([]))

export const ScenariosProvider = (props) => {
    const { userDoc } = useUserDoc(null)

    const [scenariosCollection, setScenariosCollection] = useState(null)
    const [scenarios, setScenarios] = useState([])

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

                    const scenariosQueried = []
                    querySnapshot.forEach(doc => {
                        const data = doc.data()
                        data.id = doc.id
                        scenariosQueried.push(data)
                    })

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