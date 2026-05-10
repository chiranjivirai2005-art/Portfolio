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

const publishSectionOptions = [
  { value: 'current', label: 'Current item only' },
  { value: 'certificates', label: 'Certificates page' },
  { value: 'gallery', label: 'Gallery page' },
  { value: 'courses', label: 'Courses page' },
  { value: 'achievements', label: 'Achievements page' },
  { value: 'extracurricular', label: 'Extracurricular page' },
  { value: 'custom', label: 'Custom category only' },
]

const attachmentTypeOptions = [
  { value: 'certificate', label: 'Certificate' },
  { value: 'gallery-image', label: 'Gallery picture' },
  { value: 'event-photo', label: 'Event photo' },
  { value: 'project-photo', label: 'Project photo' },
  { value: 'course-proof', label: 'Course proof' },
  { value: 'report', label: 'Report' },
  { value: 'document', label: 'Document' },
  { value: 'custom', label: 'Self defined' },
]

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
  attachments: [],
  featured: false,
}

function createAttachmentDraft() {
  return {
    customCategory: '',
    file: null,
    name: '',
    publishTo: 'current',
    type: 'certificate',
    url: '',
  }
}

function getAttachmentLabel(attachment) {
  if (attachment.type === 'custom') {
    return attachment.customCategory || 'Custom file'
  }

  return attachmentTypeOptions.find((option) => option.value === attachment.type)?.label || 'File'
}

function getPublishedPayload({ attachment, collectionName, form, parentId }) {
  const title = attachment.name || form.title || getAttachmentLabel(attachment)
  const summary = form.summary || `${getAttachmentLabel(attachment)} uploaded from ${collectionName}.`
  const achievementId = collectionName === 'achievements' ? parentId : form.achievementId

  const shared = {
    attachments: [attachment],
    category: attachment.customCategory || form.category || getAttachmentLabel(attachment),
    summary,
    title,
    year: form.year,
  }

  if (attachment.publishTo === 'certificates') {
    return {
      achievementId,
      attachments: [attachment],
      courseId: form.courseId,
      eventId: form.eventId,
      fileUrl: attachment.url,
      issuer: form.issuer || attachment.customCategory || 'Uploaded certificate',
      title,
      year: form.year,
    }
  }

  if (attachment.publishTo === 'gallery') {
    return {
      achievementId,
      attachments: [attachment],
      eventId: form.eventId,
      imageUrl: attachment.url,
      title,
    }
  }

  if (attachment.publishTo === 'courses') {
    return {
      attachments: [attachment],
      provider: form.provider || attachment.customCategory || 'Uploaded course file',
      summary,
      title,
      year: form.year,
    }
  }

  if (attachment.publishTo === 'achievements') {
    return {
      ...shared,
      courseId: form.courseId,
      featured: false,
    }
  }

  if (attachment.publishTo === 'extracurricular') {
    return shared
  }

  return null
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
  const [attachments, setAttachments] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const visibleFields = useMemo(() => {
    const shared = ['title', 'summary']
    const map = {
      courses: [...shared, 'provider', 'year'],
      achievements: [...shared, 'category', 'year', 'courseId', 'featured'],
      certificates: ['title', 'issuer', 'year', 'courseId', 'achievementId', 'eventId', 'fileUrl'],
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
      const payload = visibleFields.reduce((acc, field) => {
        acc[field] = form[field]
        return acc
      }, {})

      const savedAttachments = []

      for (const attachment of attachments) {
        if (attachment.url && !attachment.file) {
          savedAttachments.push({
            customCategory: attachment.customCategory || '',
            name: attachment.name,
            publishTo: attachment.publishTo || 'current',
            publishedId: attachment.publishedId || '',
            type: attachment.type,
            url: attachment.url,
          })
        }

        if (attachment.file) {
          const url = await uploadToCloudinary(attachment.file)
          savedAttachments.push({
            customCategory: attachment.customCategory || '',
            name: attachment.name || attachment.file.name,
            publishTo: attachment.publishTo || 'current',
            publishedId: '',
            type: attachment.type,
            url,
          })
        }
      }

      payload.attachments = savedAttachments

      if (savedAttachments.length) {
        const firstCertificate = savedAttachments.find((attachment) => attachment.type === 'certificate')
        const firstImage = savedAttachments.find((attachment) =>
          ['gallery-image', 'event-photo', 'project-photo'].includes(attachment.type),
        )

        if (!payload.fileUrl && firstCertificate) {
          payload.fileUrl = firstCertificate.url
        }

        if (!payload.imageUrl && firstImage) {
          payload.imageUrl = firstImage.url
        }
      }

      const parentId = editingId || (await createCollectionItem(collectionName, payload))

      if (editingId) {
        await updateCollectionItem(collectionName, editingId, payload)
      }

      const publishedAttachments = []
      let publishedAnyAttachment = false

      for (const attachment of savedAttachments) {
        if (
          attachment.publishedId ||
          !collectionOptions.includes(attachment.publishTo) ||
          attachment.publishTo === collectionName
        ) {
          publishedAttachments.push(attachment)
          continue
        }

        const publishedPayload = getPublishedPayload({
          attachment,
          collectionName,
          form,
          parentId,
        })

        if (!publishedPayload) {
          publishedAttachments.push(attachment)
          continue
        }

        const publishedId = await createCollectionItem(attachment.publishTo, publishedPayload)
        publishedAnyAttachment = true
        publishedAttachments.push({
          ...attachment,
          publishedId,
        })
      }

      if (publishedAnyAttachment) {
        await updateCollectionItem(collectionName, parentId, {
          attachments: publishedAttachments,
        })
      }

      setForm(initialForm)
      setEditingId('')
      setAttachments([])
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
    setAttachments(Array.isArray(item.attachments) ? item.attachments.map((attachment) => ({ ...attachment, file: null })) : [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addAttachmentDraft() {
    setAttachments((current) => [...current, createAttachmentDraft()])
  }

  function updateAttachment(index, updates) {
    setAttachments((current) =>
      current.map((attachment, attachmentIndex) =>
        attachmentIndex === index ? { ...attachment, ...updates } : attachment,
      ),
    )
  }

  function removeAttachment(index) {
    setAttachments((current) => current.filter((_, attachmentIndex) => attachmentIndex !== index))
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
              setAttachments([])
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
            <section className="rounded-lg border border-slate-200 bg-white/60 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Files</h3>
                  <p className="mt-1 text-sm font-normal text-slate-500">
                      Add uploads, choose where they should appear, and use a standard or custom label.
                  </p>
                </div>
                <button className="secondary-button px-3 py-2 text-sm" onClick={addAttachmentDraft} type="button">
                  Add files
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {attachments.map((attachment, index) => (
                  <div className="rounded-lg border border-slate-200 bg-white p-3" key={`${attachment.url || attachment.name}-${index}`}>
                    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto] md:items-end">
                      <label className="text-sm font-semibold text-slate-700">
                        File
                        <input
                          className="field mt-2"
                          type="file"
                          onChange={(event) => {
                            const selectedFile = event.target.files?.[0] || null
                            updateAttachment(index, {
                              file: selectedFile,
                              name: selectedFile?.name || attachment.name,
                            })
                          }}
                        />
                      </label>
                      <label className="text-sm font-semibold text-slate-700">
                        Show in section
                        <select
                          className="field mt-2"
                          value={attachment.publishTo || 'current'}
                          onChange={(event) => updateAttachment(index, { publishTo: event.target.value })}
                        >
                          {publishSectionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm font-semibold text-slate-700">
                        File category
                        <select
                          className="field mt-2"
                          value={attachment.type}
                          onChange={(event) => updateAttachment(index, { type: event.target.value })}
                        >
                          {attachmentTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="rounded-md bg-red-600 px-3 py-3 text-sm font-semibold text-white"
                        onClick={() => removeAttachment(index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                    {(attachment.type === 'custom' || attachment.publishTo === 'custom') ? (
                      <label className="mt-3 block text-sm font-semibold text-slate-700">
                        Self defined category
                        <input
                          className="field mt-2"
                          placeholder="Enter custom category"
                          value={attachment.customCategory || ''}
                          onChange={(event) => updateAttachment(index, { customCategory: event.target.value })}
                        />
                      </label>
                    ) : null}
                    {attachment.url ? (
                      <a className="mt-3 inline-block text-sm font-semibold text-[#1f6f78]" href={attachment.url} rel="noreferrer" target="_blank">
                        Existing uploaded file
                      </a>
                    ) : null}
                  </div>
                ))}
                {!attachments.length ? (
                  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm font-normal text-slate-500">
                    No files added yet.
                  </p>
                ) : null}
              </div>
            </section>
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
                setAttachments([])
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
                {Array.isArray(item.attachments) && item.attachments.length ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.attachments.length} file{item.attachments.length === 1 ? '' : 's'} attached
                  </p>
                ) : null}
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
