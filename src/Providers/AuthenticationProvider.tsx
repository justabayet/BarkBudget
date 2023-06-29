import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { DocumentReference, collection, doc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import AccountDeletedSnackbar from "../Components/AccountDeletedSnackbar"
import { auth, db } from '../firebase'
import { useFirebaseRepository } from "./FirebaseRepositoryProvider"
import { useLoadingStatus } from "./LoadingStatusProvider"

type UserType = { uid: string, displayName: string | null, email: string | null }
class Authentication {
    constructor(
        public user: UserType | null,
        public handleSignIn: () => void,
        public signInTestAccount: () => void,
        public handleSignOut: () => void,
        public userDoc: DocumentReference | null,
        public deleteAccount: () => void) { }
}

const testUser: UserType = {
    uid: '4EpqCHlAAFS0jvJyi1qLIJUH8o62',
    displayName: 'Test Account',
    email: 'test.account@gmail.com'
}

const AuthenticationContext = createContext(new Authentication(null, () => { }, () => { }, () => { }, null, () => { }))

export const AuthenticationProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [user, setUser] = useState<UserType | null>(null)
    const [userDoc, setUserDoc] = useState<DocumentReference | null>(null)
    const [openAcountDeletedSnackbar, setOpenAccountDeletedSnackbar] = useState<boolean>(false)
    const [_signingIn, _setSigningIn] = useState<boolean>(false)
    const { deleteDoc, setCanUpdate, deleteScenarioFirestore } = useFirebaseRepository()

    const [isTestAccount, setIsTestAccount] = useState<boolean>(false)

    const { setSigningIn } = useLoadingStatus()

    useEffect(() => {
        setSigningIn(_signingIn)
    }, [_signingIn, setSigningIn])


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

            setCanUpdate(!isTestAccount)
        } else {
            setUserDoc(null)
        }
    }, [user, setCanUpdate, isTestAccount])

    const handleSignIn = (): void => {
        const provider = new GoogleAuthProvider()
        _setSigningIn(true)
        setIsTestAccount(false)
        signInWithPopup(auth, provider).finally(() => { _setSigningIn(false) })
    }

    const signInTestAccount = (): void => {
        setIsTestAccount(true)
        setUser(testUser)
    }

    const handleSignOut = async (): Promise<void> => {
        if (user) {
            if (isTestAccount) {
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
            value={(new Authentication(user, handleSignIn, signInTestAccount, handleSignOut, userDoc, deleteAccount))}
        >
            {children}
            <AccountDeletedSnackbar eventOpen={openAcountDeletedSnackbar} setEventOpen={setOpenAccountDeletedSnackbar} />
        </AuthenticationContext.Provider>
    )
}

export const useAuthentication = () => {
    return useContext(AuthenticationContext)
}