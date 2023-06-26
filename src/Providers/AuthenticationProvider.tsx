import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { DocumentReference, collection, doc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import AccountDeletedSnackbar from "../Components/AccountDeletedSnackbar"
import { auth, db } from '../firebase'
import { useFirebaseRepository } from "./FirebaseRepositoryProvider"

type UserType = { uid: string, displayName: string | null, email: string | null }
class Authentication {
    user: UserType | null
    handleSignIn: () => void
    signInTestAccount: () => void
    handleSignOut: () => void
    userDoc: DocumentReference | null
    deleteAccount: () => void
    signingIn: boolean

    constructor(
        user: UserType | null,
        handleSignIn: () => void,
        signInTestAccount: () => void,
        handleSignOut: () => void,
        userDoc: DocumentReference | null,
        deleteAccount: () => void,
        signingIn: boolean) {

        this.user = user
        this.handleSignIn = handleSignIn
        this.signInTestAccount = signInTestAccount
        this.handleSignOut = handleSignOut
        this.userDoc = userDoc
        this.deleteAccount = deleteAccount
        this.signingIn = signingIn
    }
}

const testUser: UserType = {
    uid: '4EpqCHlAAFS0jvJyi1qLIJUH8o62',
    displayName: 'Test Account',
    email: 'test.account@gmail.com'
}

const AuthenticationContext = createContext(new Authentication(null, () => { }, () => { }, () => { }, null, () => { }, false))

export const AuthenticationProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [user, setUser] = useState<UserType | null>(null)
    const [userDoc, setUserDoc] = useState<DocumentReference | null>(null)
    const [openAcountDeletedSnackbar, setOpenAccountDeletedSnackbar] = useState<boolean>(false)
    const [signingIn, setSigningIn] = useState<boolean>(false)
    const { deleteDoc, setCanUpdate, deleteScenarioFirestore } = useFirebaseRepository()

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
            console.log(user.uid)
            setUserDoc(userDoc)

            if (user.uid === testUser.uid) {
                setCanUpdate(false)
            } else {
                setCanUpdate(true)
            }
        } else {
            setUserDoc(null)
        }
    }, [user, setCanUpdate])

    const handleSignIn = (): void => {
        const provider = new GoogleAuthProvider()
        setSigningIn(true)
        signInWithPopup(auth, provider).finally(() => { setSigningIn(false) })
    }

    const signInTestAccount = (): void => {
        setUser(testUser)
    }

    const handleSignOut = async (): Promise<void> => {
        if (user) {
            if (user.uid === testUser.uid) {
                setUser(null)
            } else {
                signOut(auth)
            }
        }
    }

    const deleteAccount = (): void => {
        console.log(`Delete in process: user account ${userDoc?.path}`)
        if (userDoc) {
            const scenariosCollection = collection(userDoc, 'scenarios')

            getDocs(scenariosCollection).then((async querySnapshot => {
                await Promise.all(querySnapshot.docs.map(async document => {
                    await deleteScenarioFirestore(scenariosCollection, document.id)
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
            value={(new Authentication(user, handleSignIn, signInTestAccount, handleSignOut, userDoc, deleteAccount, signingIn))}
        >
            {children}
            <AccountDeletedSnackbar eventOpen={openAcountDeletedSnackbar} setEventOpen={setOpenAccountDeletedSnackbar} />
        </AuthenticationContext.Provider>
    )
}

export const useAuthentication = () => {
    return useContext(AuthenticationContext)
}