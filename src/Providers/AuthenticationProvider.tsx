import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { DocumentReference, FirestoreDataConverter, collection, doc, getDoc, getDocs } from "firebase/firestore"
import React, { createContext, useContext, useEffect, useState } from "react"
import AccountDeletedSnackbar from "../Components/AccountDeletedSnackbar"
import { auth, db } from '../firebase'
import { useFirebaseRepository } from "./FirebaseRepositoryProvider"
import { useLoadingStatus } from "./LoadingStatusProvider"

type UserType = { uid: string, displayName: string | null, email: string | null, scenarioId?: string | null }
type UserAuthenticationType = { uid: string, displayName: string | null, email: string | null }
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

interface UserFirestore {
    scenarioId?: string | null
}

const converter: FirestoreDataConverter<UserType> = {
    toFirestore(user: UserType): UserFirestore {
        return {
            scenarioId: user.scenarioId
        }
    },
    fromFirestore(snapshot: any, options?: any): UserType {
        const userDb: UserFirestore = snapshot.data()
        const scenarioId = userDb.scenarioId

        return { scenarioId } as UserType
    }
}
const usersCollection = collection(db, 'users').withConverter(converter)

export const AuthenticationProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [user, setUser] = useState<UserType | null>(null)
    const [userAuthentication, setUserAuthentication] = useState<UserAuthenticationType | null>(null)
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
                console.log("Signed in: ", user)
                setUserAuthentication(user)
            } else {
                console.log("Signed out")
                setUserAuthentication(null)
            }
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        if (userAuthentication) {
            const userDoc = doc(usersCollection, userAuthentication.uid)
            console.log(userAuthentication.uid)

            getDoc(userDoc).then((snapshot) => {
                setUser({ ...snapshot.data(), ...userAuthentication })
                setUserDoc(userDoc)

                setCanUpdate(!isTestAccount)
            })
        } else {
            setUserDoc(null)
        }
    }, [userAuthentication, setCanUpdate, isTestAccount])

    const handleSignIn = (): void => {
        const provider = new GoogleAuthProvider()
        _setSigningIn(true)
        setIsTestAccount(false)
        signInWithPopup(auth, provider).finally(() => { _setSigningIn(false) })
    }

    const signInTestAccount = (): void => {
        setIsTestAccount(true)
        setUserAuthentication(testUser)
    }

    const handleSignOut = async (): Promise<void> => {
        if (userAuthentication) {
            if (isTestAccount) {
                setUserAuthentication(null)
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