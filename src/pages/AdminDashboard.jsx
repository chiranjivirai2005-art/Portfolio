import { useCallback, useEffect, useMemo, useState } from 'react'
import HomepageManager from '../components/HomepageManager.jsx'
import PageTransition from '../components/PageTransition.jsx'
import { useAuth } from '../context/useAuth.js'
import { adminEmail, isAdminUser } from '../services/admin.js'
import { uploadToCloudinary } from '../services/cloudinary.js'
import {
  createCollectionItem,
  deleteCollectionItem,
  getCollectionItems,
  updateCollectionItem,
} from '../services/firestore.js'

const collectionOptions = ['courses', 'achievements', 'certificates', 'gallery', 'extracurricular']

const initialForm = {
  title: '',
  summary: '',
  year: '',
  category: '',
  provider: '',
  issuer: '',
  courseId: '',
  achievementId: '',
  eventId: '',
  imageUrl: '',
  fileUrl: '',
  featured: false,
}

function AdminDashboard() {
  const { login, logout, user } = useAuth()
  const isAdmin = isAdminUser(user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [collectionName, setCollectionName] = useState('achievements')
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const visibleFields = useMemo(() => {
    const shared = ['title', 'summary']
    const map = {
      courses: [...shared, 'provider', 'year'],
      achievements: [...shared, 'category', 'year', 'courseId', 'featured'],
      certificates: ['title', 'issuer', 'year', 'courseId', 'achievementId', 'fileUrl'],
      gallery: ['title', 'achievementId', 'eventId', 'imageUrl'],
      extracurricular: [...shared, 'category'],
    }

    return map[collectionName]
  }, [collectionName])

  const loadItems = useCallback(async () => {
    try {
      const result = await getCollectionItems(collectionName)
      setItems(result)
      setStatus(result.length ? 'Data loaded.' : 'No Firestore documents yet.')
    } catch (error) {
      setItems([])
      setStatus(`Firestore read failed: ${error.message}`)
    }
  }, [collectionName])

  useEffect(() => {
    let ignore = false

    async function loadInitialItems() {
      if (!isAdmin) {
        return
      }

      try {
        const result = await getCollectionItems(collectionName)

        if (!ignore) {
          setItems(result)
          setStatus(result.length ? 'Data loaded.' : 'No Firestore documents yet.')
        }
      } catch (error) {
        if (!ignore) {
          setItems([])
          setStatus(`Firestore read failed: ${error.message}`)
        }
      }
    }

    loadInitialItems()

    return () => {
      ignore = true
    }
  }, [collectionName, isAdmin])

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setStatus('Signing in...')
    try {
      await login(email, password)
      setStatus('Signed in.')
    } catch (error) {
      setStatus(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus('Saving...')

    try {
      let mediaUrl = ''
      if (file) {
        mediaUrl = await uploadToCloudinary(file)
      }

      const payload = visibleFields.reduce((acc, field) => {
        acc[field] = form[field]
        return acc
      }, {})

      if (mediaUrl) {
        if (collectionName === 'gallery') {
          payload.imageUrl = mediaUrl
        } else {
          payload.fileUrl = mediaUrl
        }
      }

      if (editingId) {
        await updateCollectionItem(collectionName, editingId, payload)
      } else {
        await createCollectionItem(collectionName, payload)
      }

      setForm(initialForm)
      setEditingId('')
      setFile(null)
      await loadItems()
      setStatus('Saved successfully.')
    } catch (error) {
      setStatus(`Save failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({ ...initialForm, ...item })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeItem(id) {
    setLoading(true)
    setStatus('Deleting...')
    try {
      await deleteCollectionItem(collectionName, id)
      await loadItems()
      setStatus('Deleted.')
    } catch (error) {
      setStatus(`Delete failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="ink-panel mx-auto max-w-md rounded-lg p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f0b765]">
            Private area
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Admin login</h1>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input
              className="field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className="primary-button w-full px-4 py-3 disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              Sign in
            </button>
          </form>
          {status ? <p className="mt-4 text-sm text-slate-200">{status}</p> : null}
        </div>
      </PageTransition>
    )
  }

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="ink-panel mx-auto max-w-xl rounded-lg p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f0b765]">
            Access denied
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">This dashboard is private.</h1>
          <p className="mt-4 leading-7 text-slate-200">
            Signed in as {user.email}. Portfolio management is restricted to {adminEmail}.
          </p>
          <button className="primary-button mt-6 px-4 py-3" onClick={logout}>
            Sign out
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f6f78]">
            Secure workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Admin dashboard</h1>
          <p className="mt-2 text-slate-200">Signed in as {user.email}</p>
        </div>
        <button className="secondary-button px-4 py-2" onClick={logout}>
          Sign out
        </button>
      </div>

      <div className="mb-6">
        <HomepageManager />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="surface-panel rounded-lg p-5" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-slate-700" htmlFor="collection">
            Collection
          </label>
          <select
            id="collection"
            className="field mt-2"
            value={collectionName}
            onChange={(event) => {
              setCollectionName(event.target.value)
              setForm(initialForm)
              setEditingId('')
            }}
          >
            {collectionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="mt-5 grid gap-4">
            {visibleFields.map((field) => (
              <label key={field} className="text-sm font-semibold capitalize text-slate-700">
                {field}
                {field === 'featured' ? (
                  <input
                    className="ml-3 h-5 w-5 align-middle"
                    type="checkbox"
                    checked={Boolean(form.featured)}
                    onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                  />
                ) : (
                  <input
                    className="field mt-2 font-normal normal-case"
                    value={form[field] || ''}
                    onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                    placeholder={`Enter ${field}`}
                  />
                )}
              </label>
            ))}
            <label className="text-sm font-semibold text-slate-700">
              Cloudinary file
              <input
                className="field mt-2"
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            className="primary-button mt-5 w-full px-4 py-3 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {editingId ? 'Update document' : 'Create document'}
          </button>
          {editingId ? (
            <button
              className="secondary-button mt-3 w-full px-4 py-3"
              type="button"
              onClick={() => {
                setEditingId('')
                setForm(initialForm)
              }}
            >
              Cancel edit
            </button>
          ) : null}
          {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
        </form>

        <section className="surface-panel rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">Firestore documents</h2>
            <button className="secondary-button px-3 py-2 text-sm" onClick={loadItems}>
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200/80 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.id}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.title || 'Untitled'}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.summary || item.imageUrl || item.fileUrl}</p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => removeItem(item.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {!items.length ? <p className="text-slate-500">No documents loaded from Firestore yet.</p> : null}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default AdminDashboard
