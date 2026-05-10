import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { auth } from '../services/firebase'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user
      },
      logout: async () => {
        await signOut(auth)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
