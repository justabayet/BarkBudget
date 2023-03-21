
import { doc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { db } from '../firebase'
import { useAuthentication } from "./AuthenticationProvider"

class Database {
    constructor(database) {
        this.database = database
    }
}

const DatabaseContext = createContext(new Database(undefined))

export const DatabaseProvider = (props) => {
    const { user } = useAuthentication()

    const [database, setDatabase] = useState(null)

    useEffect(() => {
        if (user) {
            const firestoreConverter = {
                toFirestore: (entry) => {
                    entry.uid = user.uid
                    return entry
                },
                fromFirestore: (snapshot, options) => {
                    return snapshot.data(options)
                }
            }

            const docRef = doc(db, 'users', user.uid).withConverter(firestoreConverter)
            setDatabase(docRef)
        }

    }, [user])

    return (
        <DatabaseContext.Provider
            value={(new Database(database))}
        >
            {props.children}
        </DatabaseContext.Provider>
    )

}

export const useDatabase = () => {
    return useContext(DatabaseContext)
}