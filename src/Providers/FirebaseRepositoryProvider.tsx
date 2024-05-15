import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

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
        public cloneScenarioFirestore: (scenariosCollection: CollectionReference, sourceId: string, destinationId: string) => Promise<void>,
        public deleteScenarioFirestore: (scenariosCollection: CollectionReference, id: string) => Promise<void>
    ) { }
}

const dummyDoc = { id: generateRandomId() }

const FirebaseRepositoryContext = createContext(new FirebaseRepository(() => { }, async () => { }, async () => { return dummyDoc }, async () => { }, async () => { }, async () => { }))

export const FirebaseRepositoryProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
    const [canUpdate, setCanUpdate] = useState<boolean>(false)

    const setDocCustom = useCallback(async (reference: docRef, data: dataType) => {
        if (canUpdate) {
            return await setDoc(reference, data)
        }
    }, [canUpdate])

    const addDocCustom = useCallback(async (reference: colRef, data: dataType) => {
        if (!canUpdate) {
            return { id: generateRandomId() }
        } else {
            const document = await addDoc(reference, data)
            return { id: document.id }
        }
    }, [canUpdate])

    const deleteDocCustom = useCallback(async (reference: delRef) => {
        if (canUpdate) {
            return await deleteDoc(reference)
        }
    }, [canUpdate])

    const deleteCollection = useCallback(async (collection: CollectionReference, docType: string) => {
        const querySnapshot = await getDocs(collection)

        querySnapshot.forEach(async el => {
            await deleteDocCustom(doc(collection, el.id))
            console.log(`Delete successful: ${docType} ${el.id}`)
        })
    }, [deleteDocCustom])

    const deleteScenarioFirestore = useCallback(async (scenariosCollection: CollectionReference, id: string) => {
        const scenarioDoc = doc(scenariosCollection, id)

        const expectationsCollection = collection(scenarioDoc, 'expectations')
        const recordsCollection = collection(scenarioDoc, 'records')

        await deleteCollection(expectationsCollection, 'expectations')
        await deleteCollection(recordsCollection, 'records')

        await deleteDocCustom(doc(scenariosCollection, id))
        console.log(`Delete succesful: scenario ${id}`)
    }, [deleteCollection, deleteDocCustom])

    const cloneCollection = useCallback(async (source: CollectionReference, destination: CollectionReference, docType: string) => {
        const querySnapshot = await getDocs(source)

        querySnapshot.forEach(async el => {
            await addDocCustom(destination, el.data())
            console.log(`Cloning successful: ${docType} ${el.id}`)
        })
    }, [addDocCustom])

    const cloneScenarioFirestore = useCallback(async (scenariosCollection: CollectionReference, sourceId: string, destinationId: string) => {
        const sourceScenarioDoc = doc(scenariosCollection, sourceId)
        const destinationScenarioDoc = doc(scenariosCollection, destinationId)

        const sourceExpectationsCollection = collection(sourceScenarioDoc, 'expectations')
        const destinationExpectationsCollection = collection(destinationScenarioDoc, 'expectations')

        const sourceRecordsCollection = collection(sourceScenarioDoc, 'records')
        const destinationRecordsCollection = collection(destinationScenarioDoc, 'records')

        await cloneCollection(sourceExpectationsCollection, destinationExpectationsCollection, 'expectations')
        await cloneCollection(sourceRecordsCollection, destinationRecordsCollection, 'records')

    }, [cloneCollection])

    const value = useMemo(
        () => new FirebaseRepository(setCanUpdate, setDocCustom, addDocCustom, deleteDocCustom, cloneScenarioFirestore, deleteScenarioFirestore),
        [addDocCustom, deleteDocCustom, cloneScenarioFirestore, deleteScenarioFirestore, setDocCustom]
    )

    return (
        <FirebaseRepositoryContext.Provider value={value}>
            {children}
        </FirebaseRepositoryContext.Provider>
    )
}

export const useFirebaseRepository = () => {
    return useContext(FirebaseRepositoryContext)
}