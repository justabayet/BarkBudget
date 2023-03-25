
import { doc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { db } from '../firebase'
import { useAuthentication } from "./AuthenticationProvider"

class UserDoc {
    constructor(userDoc) {
        this.userDoc = userDoc
    }
}

const UserDocContext = createContext(new UserDoc(null))

export const UserDocProvider = (props) => {
    const { user } = useAuthentication()

    const [userDoc, setUserDoc] = useState(null)

    useEffect(() => {
        if (user) {
            const userDoc = doc(db, 'users', user.uid)
            setUserDoc(userDoc)
        } else {
            setUserDoc(null)
        }
    }, [user])

    return (
        <UserDocContext.Provider value={(new UserDoc(userDoc))}>
            {props.children}
        </UserDocContext.Provider>
    )

}

export const useUserDoc = () => {
    return useContext(UserDocContext)
}