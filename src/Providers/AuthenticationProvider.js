
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth } from '../firebase'

class Authentication {
  constructor(user, handleSignIn, handleSignOut) {
    this.user = user
    this.handleSignIn = handleSignIn
    this.handleSignOut = handleSignOut
  }
}

const AuthenticationContext = createContext(new Authentication(undefined, () => { }, () => { }))

export const AuthenticationProvider = (props) => {
  const [user, setUser] = useState(null)

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



  const handleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const handleSignOut = () => {
    signOut(auth)
  }


  return (
    <AuthenticationContext.Provider
      value={(new Authentication(user, handleSignIn, handleSignOut))}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )

}

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}