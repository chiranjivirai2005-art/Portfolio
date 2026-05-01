import { useEffect, useState } from 'react'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import {
  defaultHomeContent,
  getHomeContent,
  parseList,
  parseStats,
} from '../services/homeContent.js'
import {
  dummyAchievements,
  dummyCourses,
  dummyExtracurricular,
  dummyGallery,
} from '../services/portfolioData.js'

function Home() {
  const [content, setContent] = useState(defaultHomeContent)
  const featured = dummyAchievements.filter((item) => item.featured)
  const preview = dummyGallery.slice(0, 3)
  const focusAreas = parseList(content.focusAreas)
  const tools = parseList(content.tools)
  const projectTypes = parseList(content.projectTypes)
  const stats = parseStats(content.stats)

  useEffect(() => {
    let ignore = false

    async function loadContent() {
      try {
        const result = await getHomeContent()

        if (!ignore) {
          setContent(result)
        }
      } catch {
        if (!ignore) {
          setContent(defaultHomeContent)
        }
      }
    }

    loadContent()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <PageTransition>
      <section className="hero-wall relative min-h-[76vh] overflow-hidden rounded-lg shadow-2xl shadow-cyan-950/40">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={content.heroImageUrl}
          alt={`${content.name} portfolio wall`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.95),rgba(2,6,23,0.72)_52%,rgba(2,6,23,0.2))]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(34,211,238,0.18),transparent_42%)]" />
        <div className="relative flex min-h-[76vh] flex-col justify-end p-6 md:p-10 lg:p-14">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_260px]">
            <div className="max-w-5xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                {content.department}
              </p>
              <h1 className="mt-4 text-6xl font-black tracking-normal text-white md:text-8xl">
                {content.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-[#f0b765] md:text-3xl">{content.role}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">{content.intro}</p>
            </div>
            <div className="hero-profile mx-auto lg:mx-0">
              <img src={content.profileImageUrl} alt={content.name} />
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                className="rounded-lg border border-cyan-200/20 bg-cyan-50/10 p-4 text-white backdrop-blur"
                key={`${item.value}-${item.label}`}
              >
                <p className="text-2xl font-black text-cyan-200">{item.value}</p>
                <p className="mt-1 text-sm text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="ink-panel rounded-lg p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f0b765]">
            About
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">{content.aboutTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-slate-200">{content.aboutDetails}</p>
        </div>
        <div className="surface-panel rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Hardware Focus</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {focusAreas.map((item) => (
              <span className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-cyan-100" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Portfolio essentials
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">What I Work On</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projectTypes.map((item) => (
            <ContentCard key={item} eyebrow="Project Type" title={item}>
              <p>Hardware-first work that can be documented, tested, photographed, and managed from the dashboard.</p>
            </ContentCard>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Selected work
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Featured achievements</h2>
          </div>
          <div className="grid gap-5">
            {featured.map((item) => (
              <ContentCard key={item.id} eyebrow={`${item.category} / ${item.year}`} title={item.title}>
                <p>{item.summary}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Course ID: {item.courseId}
                </p>
              </ContentCard>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Learning path
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Courses and Tools</h2>
          </div>
          <div className="grid gap-5">
            {dummyCourses.map((item) => (
              <ContentCard key={item.id} eyebrow={`${item.provider} / ${item.year}`} title={item.title}>
                <p>{item.summary}</p>
              </ContentCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Lab stack
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Tools I Use</h2>
        </div>
        <div className="surface-panel rounded-lg p-5">
          <div className="flex flex-wrap gap-3">
            {tools.map((item) => (
              <span className="rounded-md border border-cyan-500/30 bg-white/70 px-4 py-3 text-sm font-bold text-slate-900" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Visual archive
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Gallery preview</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {preview.map((item) => (
            <ContentCard key={item.id} imageUrl={item.imageUrl} title={item.title}>
              <p>Event ID: {item.eventId}</p>
              <p>Achievement ID: {item.achievementId}</p>
            </ContentCard>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {dummyExtracurricular.map((item) => (
          <ContentCard key={item.id} eyebrow={item.category} title={item.title}>
            <p>{item.summary}</p>
          </ContentCard>
        ))}
      </section>

      <section className="mt-14 rounded-lg border border-cyan-300/20 bg-slate-950/80 p-6 text-white shadow-[0_0_40px_rgba(34,211,238,0.12)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Contact</p>
        <h2 className="mt-3 text-3xl font-semibold">Let us build something practical.</h2>
        <p className="mt-3 text-slate-200">{content.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-md bg-white px-4 py-3 font-semibold text-slate-950">{content.email}</span>
          <span className="rounded-md border border-white/20 px-4 py-3 font-semibold text-white">{content.location}</span>
        </div>
      </section>
    </PageTransition>
  )
}

export default Home
