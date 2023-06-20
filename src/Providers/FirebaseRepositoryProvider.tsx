import { CollectionReference, DocumentData, DocumentReference, WithFieldValue, addDoc, deleteDoc, setDoc } from 'firebase/firestore'
import React, { createContext, useContext, useState } from 'react'
import { generateRandomId } from '../helpers'

type docRef = DocumentReference<DocumentData>
type colRef = CollectionReference<DocumentData>
type delRef = DocumentReference<unknown>
type dataType = WithFieldValue<DocumentData>
type objWithId = { id: string }

class FirebaseRepository {
    setCanUpdate: (newState: boolean) => void
    setDoc: (reference: docRef, data: dataType) => Promise<void>
    addDoc: (reference: colRef, data: dataType) => Promise<objWithId>
    deleteDoc: (reference: DocumentReference<unknown>) => Promise<void>


    constructor(
        setCanUpdate: (newState: boolean) => void,
        setDoc: (reference: docRef, data: dataType) => Promise<void>,
        addDoc: (reference: colRef, data: dataType) => Promise<objWithId>,
        deleteDoc: (reference: delRef) => Promise<void>
    ) {
        this.setCanUpdate = setCanUpdate
        this.setDoc = setDoc
        this.addDoc = addDoc
        this.deleteDoc = deleteDoc
    }
}

const dummyDoc = { id: generateRandomId() }

const FirebaseRepositoryContext = createContext(new FirebaseRepository(() => { }, async () => { }, async () => { return dummyDoc }, async () => { }))

export const FirebaseRepositoryProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [canUpdate, setCanUpdate] = useState<boolean>(false)

    const setDocCustom = async (reference: docRef, data: dataType) => {
        if (canUpdate) {
            return await setDoc(reference, data)
        }
    }

    const addDocCustom = async (reference: colRef, data: dataType) => {
        if (!canUpdate) {
            return { id: generateRandomId() }
        } else {
            const document = await addDoc(reference, data)
            return { id: document.id }
        }
    }

    const deleteDocCustom = async (reference: delRef) => {
        if (canUpdate) {
            return await deleteDoc(reference)
        }
    }

    return (
        <FirebaseRepositoryContext.Provider value={new FirebaseRepository(setCanUpdate, setDocCustom, addDocCustom, deleteDocCustom)}>
            {children}
        </FirebaseRepositoryContext.Provider>
    )
}

export const useFirebaseRepository = () => {
    return useContext(FirebaseRepositoryContext)
}