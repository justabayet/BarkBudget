import React, { createContext, useContext, useState } from 'react'

import { CollectionReference, DocumentData, DocumentReference, WithFieldValue, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'

import { generateRandomId } from 'helpers'

export type docRef = DocumentReference<DocumentData>
export type colRef = CollectionReference<DocumentData>
export type delRef = DocumentReference<unknown>
export type dataType = WithFieldValue<DocumentData>
export type objWithId = { id: string }

class FirebaseRepository {
    constructor(
        public setCanUpdate: (newState: boolean) => void,
        public setDoc: (reference: docRef, data: dataType) => Promise<void>,
        public addDoc: (reference: colRef, data: dataType) => Promise<objWithId>,
        public deleteDoc: (reference: delRef) => Promise<void>,
        public deleteScenarioFirestore: (scenariosCollection: CollectionReference, id: string) => Promise<void>
    ) { }
}

const dummyDoc = { id: generateRandomId() }

const FirebaseRepositoryContext = createContext(new FirebaseRepository(() => { }, async () => { }, async () => { return dummyDoc }, async () => { }, async () => { }))

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

    const deleteCollection = async (collection: CollectionReference, docType: string) => {
        const querySnapshot = await getDocs(collection)

        querySnapshot.forEach(async el => {
            await deleteDocCustom(doc(collection, el.id))
            console.log(`Delete successful: ${docType} ${el.id}`)
        })
    }

    const deleteScenarioFirestore = async (scenariosCollection: CollectionReference, id: string) => {
        const scenarioDoc = doc(scenariosCollection, id)

        const expectationsCollection = collection(scenarioDoc, 'expectations')
        const limitsCollection = collection(scenarioDoc, 'limits')
        const recordsCollection = collection(scenarioDoc, 'records')

        await deleteCollection(expectationsCollection, 'expectations')
        await deleteCollection(limitsCollection, 'limits')
        await deleteCollection(recordsCollection, 'records')

        await deleteDocCustom(doc(scenariosCollection, id))
        console.log(`Delete succesful: scenario ${id}`)
    }

    return (
        <FirebaseRepositoryContext.Provider value={new FirebaseRepository(setCanUpdate, setDocCustom, addDocCustom, deleteDocCustom, deleteScenarioFirestore)}>
            {children}
        </FirebaseRepositoryContext.Provider>
    )
}

export const useFirebaseRepository = () => {
    return useContext(FirebaseRepositoryContext)
}