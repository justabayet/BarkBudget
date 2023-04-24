import React from "react"
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from '../firebase'
import { DocumentReference, doc } from "firebase/firestore"

class Authentication {
  user: User | null
  handleSignIn: () => void
  handleSignOut: () => void
  userDoc: DocumentReference | null

  constructor(
    user: User | null,
    handleSignIn: () => void,
    handleSignOut: () => void,
    userDoc: DocumentReference | null) {

    this.user = user
    this.handleSignIn = handleSignIn
    this.handleSignOut = handleSignOut
    this.userDoc = userDoc
  }
}

const AuthenticationContext = createContext(new Authentication(null, () => { }, () => { }, null))

export const AuthenticationProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [userDoc, setUserDoc] = useState<DocumentReference | null>(null)

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

  const handleSignOut = (): void => {
    signOut(auth)
  }


  return (
    <AuthenticationContext.Provider
      value={(new Authentication(user, handleSignIn, handleSignOut, userDoc))}
    >
      {children}
    </AuthenticationContext.Provider>
  )

}

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}