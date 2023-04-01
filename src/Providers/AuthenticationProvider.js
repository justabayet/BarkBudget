
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from '../firebase'
import { doc } from "firebase/firestore"

class Authentication {
  constructor(user, handleSignIn, handleSignOut, userDoc) {
    this.user = user
    this.handleSignIn = handleSignIn
    this.handleSignOut = handleSignOut
    this.userDoc = userDoc
  }
}

const AuthenticationContext = createContext(new Authentication(undefined, () => { }, () => { }, undefined))

export const AuthenticationProvider = (props) => {
  const [user, setUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const handleSignOut = () => {
    signOut(auth)
  }


  return (
    <AuthenticationContext.Provider
      value={(new Authentication(user, handleSignIn, handleSignOut, userDoc))}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )

}

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}