import { useEffect, useState } from 'react'
import { subscribeCollectionItems } from './firestore.js'

export function useCollectionItems(collectionName) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeCollectionItems(
      collectionName,
      (result) => {
        setItems(result)
        setError('')
        setLoading(false)
      },
      (snapshotError) => {
        setItems([])
        setError(snapshotError.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [collectionName])

  return { error, items, loading }
}
