
import { doc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { db } from '../firebase'
import { useAuthentication } from "./AuthenticationProvider"
import { ExpensesProvider } from "./ExpensesProvider"
import { TargetsProvider } from "./TargetsProvider"
import { ValuesProvider } from "./ValuesProvider"

class Database {
    constructor(database) {
        this.database = database
    }
}

const DatabaseContext = createContext(new Database([], [], []))

export const DatabaseProvider = (props) => {
    const { user } = useAuthentication()

    const [database, setDatabase] = useState(null)

    useEffect(() => {
        if (user) {
            const userDoc = doc(db, 'users', user.uid)
            setDatabase(userDoc)
        } else {
            setDatabase(null)
        }

    }, [user])

    return (
        <DatabaseContext.Provider value={(new Database(database))}>
            <TargetsProvider>
                <ExpensesProvider>
                    <ValuesProvider>
                        {props.children}
                    </ValuesProvider>
                </ExpensesProvider>
            </TargetsProvider>
        </DatabaseContext.Provider>
    )

}

export const useDatabase = () => {
    return useContext(DatabaseContext)
}