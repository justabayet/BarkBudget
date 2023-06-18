import { GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { CollectionReference, DocumentReference, collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import AccountDeletedSnackbar from "../Components/AccountDeletedSnackbar"
import { auth, db } from '../firebase'

class Authentication {
    user: User | null
    handleSignIn: () => void
    handleSignOut: () => void
    userDoc: DocumentReference | null
    deleteAccount: () => void

    constructor(
        user: User | null,
        handleSignIn: () => void,
        handleSignOut: () => void,
        userDoc: DocumentReference | null,
        deleteAccount: () => void) {

        this.user = user
        this.handleSignIn = handleSignIn
        this.handleSignOut = handleSignOut
        this.userDoc = userDoc
        this.deleteAccount = deleteAccount
    }
}

const AuthenticationContext = createContext(new Authentication(null, () => { }, () => { }, null, () => { }))

export const AuthenticationProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [user, setUser] = useState<User | null>(null)
    const [userDoc, setUserDoc] = useState<DocumentReference | null>(null)
    const [openAcountDeletedSnackbar, setOpenAccountDeletedSnackbar] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user): void => {
            if (user) {
                console.log("Signed in")
                setUser(user)
            } else {
                console.log("Signed out")
                setUser(null)
            }
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        if (user) {
            const userDoc = doc(db, 'users', user.uid)
            setUserDoc(userDoc)
        } else {
            setUserDoc(null)
        }
    }, [user])

    const handleSignIn = (): void => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
    }

    const handleSignOut = async (): Promise<void> => {
        signOut(auth)
    }

    const deleteAccount = (): void => {
        const deleteCollection = async (collection: CollectionReference, docType: string) => {
            const querySnapshot = await getDocs(collection)

            querySnapshot.forEach(async el => {
                await deleteDoc(doc(collection, el.id))
                console.log(`Delete successful: ${docType} ${el.id}`)
            })
        }

        console.log(`Delete in process: user account ${userDoc?.path}`)
        if (userDoc) {
            const scenariosCollection = collection(userDoc, 'scenarios')

            getDocs(scenariosCollection).then((async querySnapshot => {
                await Promise.all(querySnapshot.docs.map(async document => {
                    const scenarioDoc = doc(scenariosCollection, document.id)

                    const expectationsCollection = collection(scenarioDoc, 'expenses')
                    const limitsCollection = collection(scenarioDoc, 'limits')
                    const recordsCollection = collection(scenarioDoc, 'values')

                    await deleteCollection(expectationsCollection, 'expenses')
                    await deleteCollection(limitsCollection, 'limits')
                    await deleteCollection(recordsCollection, 'values')

                    await deleteDoc(doc(scenariosCollection, document.id))
                    console.log(`Delete succesful: scenario ${document.id}`)
                }))

                deleteDoc(userDoc).then((value) => {
                    console.log(`Delete succesful: user account ${userDoc?.path}`)
                    handleSignOut().then(() => {
                        setOpenAccountDeletedSnackbar(true)
                    })
                })
            }))
        }
    }

    return (
        <AuthenticationContext.Provider
            value={(new Authentication(user, handleSignIn, handleSignOut, userDoc, deleteAccount))}
        >
            {children}
            <AccountDeletedSnackbar eventOpen={openAcountDeletedSnackbar} setEventOpen={setOpenAccountDeletedSnackbar} />
        </AuthenticationContext.Provider>
    )
}

export const useAuthentication = () => {
    return useContext(AuthenticationContext)
}