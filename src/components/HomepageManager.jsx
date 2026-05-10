import { useEffect, useState } from 'react'
import {
  defaultHomeContent,
  getHomeContent,
  updateHomeContent,
} from '../services/homeContent.js'
import { uploadToCloudinary } from '../services/cloudinary.js'

const textFields = [
  ['name', 'Name'],
  ['department', 'Department'],
  ['role', 'Role'],
  ['tagline', 'Tagline'],
  ['intro', 'Intro'],
  ['location', 'Location'],
  ['email', 'Email'],
  ['focusAreas', 'Focus areas'],
  ['stats', 'Stats'],
  ['aboutTitle', 'About title'],
  ['aboutDetails', 'About details'],
  ['projectTypes', 'Project types'],
  ['tools', 'Tools'],
]

function HomepageManager() {
  const [content, setContent] = useState(defaultHomeContent)
  const [heroFile, setHeroFile] = useState(null)
  const [profileFile, setProfileFile] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadHomepage() {
      try {
        const result = await getHomeContent()

        if (!ignore) {
          setContent(result)
          setStatus('Homepage content loaded.')
        }
      } catch (error) {
        if (!ignore) {
          setStatus(`Could not load homepage content: ${error.message}`)
        }
      }
    }

    loadHomepage()

    return () => {
      ignore = true
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setStatus('Saving homepage...')

    try {
      let heroImageUrl = content.heroImageUrl
      let profileImageUrl = content.profileImageUrl

      if (heroFile) {
        heroImageUrl = await uploadToCloudinary(heroFile)
      }

      if (profileFile) {
        profileImageUrl = await uploadToCloudinary(profileFile)
      }

      const payload = {
        ...content,
        heroImageUrl,
        profileImageUrl,
      }

      await updateHomeContent(payload)
      setContent(payload)
      setHeroFile(null)
      setProfileFile(null)
      setStatus('Homepage updated.')
    } catch (error) {
      setStatus(`Homepage save failed: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="surface-panel rounded-lg p-5" onSubmit={handleSubmit}>
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f6f78]">
          Homepage manager
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Hero wall and front page</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use commas for lists. Stats use this format: value|label, value|label.
        </p>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_180px]">
        {content.heroImageUrl ? (
          <img
            className="aspect-[16/7] w-full rounded-lg object-cover"
            src={content.heroImageUrl}
            alt="Current hero wall"
          />
        ) : null}
        {content.profileImageUrl ? (
          <img
            className="aspect-square w-full rounded-full border-4 border-cyan-300 object-cover shadow-[0_0_28px_rgba(34,211,238,0.45)]"
            src={content.profileImageUrl}
            alt="Current profile"
          />
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Hero wall photo
          <input
            className="field mt-2"
            type="file"
            accept="image/*"
            onChange={(event) => setHeroFile(event.target.files?.[0] || null)}
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Profile circle photo
          <input
            className="field mt-2"
            type="file"
            accept="image/*"
            onChange={(event) => setProfileFile(event.target.files?.[0] || null)}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {textFields.map(([field, label]) => {
          const isLong = ['intro', 'aboutDetails', 'projectTypes', 'tools', 'focusAreas'].includes(field)

          return (
            <label className="text-sm font-semibold text-slate-700" key={field}>
              {label}
              {isLong ? (
                <textarea
                  className="field mt-2 min-h-28 resize-y font-normal"
                  value={content[field] || ''}
                  onChange={(event) =>
                    setContent((current) => ({ ...current, [field]: event.target.value }))
                  }
                />
              ) : (
                <input
                  className="field mt-2 font-normal"
                  value={content[field] || ''}
                  onChange={(event) =>
                    setContent((current) => ({ ...current, [field]: event.target.value }))
                  }
                />
              )}
            </label>
          )
        })}
      </div>

      <button className="primary-button mt-5 px-4 py-3 disabled:opacity-60" disabled={saving} type="submit">
        Save homepage
      </button>
      {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
    </form>
  )
}

export default HomepageManager
