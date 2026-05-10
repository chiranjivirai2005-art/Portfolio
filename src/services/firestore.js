import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export async function getCollectionItems(collectionName) {
  const ref = collection(db, collectionName)
  const snapshot = await getDocs(query(ref, orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export function subscribeCollectionItems(collectionName, onItems, onError) {
  const ref = collection(db, collectionName)
  const collectionQuery = query(ref, orderBy('createdAt', 'desc'))

  return onSnapshot(
    collectionQuery,
    (snapshot) => {
      onItems(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      )
    },
    onError,
  )
}

export async function createCollectionItem(collectionName, payload) {
  const ref = collection(db, collectionName)
  const docRef = await addDoc(ref, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateCollectionItem(collectionName, id, payload) {
  const ref = doc(db, collectionName, id)
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCollectionItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id))
}

export async function getDocument(collectionName, id) {
  const snapshot = await getDoc(doc(db, collectionName, id))

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function setDocument(collectionName, id, payload) {
  await setDoc(
    doc(db, collectionName, id),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
