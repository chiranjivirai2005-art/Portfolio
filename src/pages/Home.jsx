import { useEffect, useState } from 'react'
import AttachmentLinks from '../components/AttachmentLinks.jsx'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import RelationLink from '../components/RelationLink.jsx'
import {
  defaultHomeContent,
  getHomeContent,
  parseList,
  parseStats,
} from '../services/homeContent.js'
import { CollectionStatus } from '../services/collectionStatus.jsx'
import { getPrimaryImageUrl } from '../services/relations.js'
import { useCollectionItems } from '../services/useCollectionItems.js'

function Home() {
  const [content, setContent] = useState(defaultHomeContent)
  const achievements = useCollectionItems('achievements')
  const courses = useCollectionItems('courses')
  const extracurricular = useCollectionItems('extracurricular')
  const gallery = useCollectionItems('gallery')
  const featured = achievements.items.filter((item) => item.featured)
  const preview = gallery.items.slice(0, 3)
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
      <section className="premium-hero relative min-h-[76vh] overflow-hidden rounded-lg shadow-2xl shadow-slate-950/50">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={content.heroImageUrl}
          alt={`${content.name} portfolio wall`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,24,0.96),rgba(9,21,42,0.78)_54%,rgba(15,23,42,0.36))]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(215,180,106,0.22),transparent_38%)]" />
        <div className="relative flex min-h-[76vh] flex-col justify-end p-6 md:p-10 lg:p-14">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_260px]">
            <div className="max-w-5xl">
              <p className="inline-flex rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">
                {content.department}
              </p>
              <h1 className="mt-5 text-6xl font-black tracking-normal text-white md:text-8xl">
                {content.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-[#f0b765] md:text-3xl">{content.role}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">{content.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="primary-button px-5 py-3" href={`mailto:${content.email}`}>
                  Contact
                </a>
                <a className="hero-outline-button px-5 py-3" href="#portfolio">
                  View portfolio
                </a>
              </div>
            </div>
            <div className="hero-profile mx-auto lg:mx-0">
              <img src={content.profileImageUrl} alt={content.name} />
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                className="rounded-lg border border-white/15 bg-white/10 p-4 text-white backdrop-blur"
                key={`${item.value}-${item.label}`}
              >
                <p className="text-2xl font-black text-[#f8dfa6]">{item.value}</p>
                <p className="mt-1 text-sm text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="ink-panel rounded-lg p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d7b46a]">
            About
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">{content.aboutTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-slate-200">{content.aboutDetails}</p>
        </div>
        <div className="surface-panel rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Hardware Focus</h2>
          <p className="mt-3 leading-7 text-slate-600">
            A clear concentration on engineering fundamentals, documentation, and practical systems.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {focusAreas.map((item) => (
              <span className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-[#f8dfa6]" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14" id="portfolio">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">
            Portfolio essentials
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">What I Work On</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projectTypes.map((item) => (
            <ContentCard key={item} eyebrow="Project Type" title={item}>
              <p>Hardware-first work with clear documentation, testing notes, media evidence, and organized project records.</p>
            </ContentCard>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">
              Selected work
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Featured achievements</h2>
          </div>
          <div className="grid gap-5">
            {featured.length ? (
              featured.map((item) => (
                <ContentCard key={item.id} eyebrow={`${item.category || 'Achievement'} / ${item.year || 'Year'}`} title={item.title || 'Untitled achievement'}>
                  <p>{item.summary}</p>
                  {item.courseId ? (
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                      Course ID: {item.courseId}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <RelationLink to={`/certificates?achievementId=${item.id}`}>Certificates</RelationLink>
                    <RelationLink to={`/gallery?achievementId=${item.id}`}>Gallery</RelationLink>
                    <AttachmentLinks attachments={item.attachments} />
                  </div>
                </ContentCard>
              ))
            ) : (
              <CollectionStatus error={achievements.error} loading={achievements.loading} name="featured achievements" />
            )}
          </div>
        </div>
        <div>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">
              Learning path
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Courses and Tools</h2>
          </div>
          <div className="grid gap-5">
            {courses.items.length ? (
              courses.items.slice(0, 3).map((item) => (
                <ContentCard key={item.id} eyebrow={`${item.provider || 'Course'} / ${item.year || 'Year'}`} title={item.title || 'Untitled course'}>
                  <p>{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <RelationLink to={`/achievements?courseId=${item.id}`}>Achievements</RelationLink>
                    <RelationLink to={`/certificates?courseId=${item.id}`}>Certificates</RelationLink>
                    <AttachmentLinks attachments={item.attachments} />
                  </div>
                </ContentCard>
              ))
            ) : (
              <CollectionStatus error={courses.error} loading={courses.loading} name="courses" />
            )}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">
            Lab stack
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Tools I Use</h2>
        </div>
        <div className="surface-panel rounded-lg p-5">
          <div className="flex flex-wrap gap-3">
            {tools.map((item) => (
              <span className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">
            Visual archive
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Gallery preview</h2>
        </div>
        {preview.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {preview.map((item) => (
              <ContentCard key={item.id} imageUrl={getPrimaryImageUrl(item)} title={item.title || 'Untitled gallery item'}>
                {item.eventId ? <p>Event ID: {item.eventId}</p> : null}
                {item.achievementId ? <p>Achievement ID: {item.achievementId}</p> : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {getPrimaryImageUrl(item) ? <RelationLink external to={getPrimaryImageUrl(item)}>Open image</RelationLink> : null}
                  <AttachmentLinks attachments={item.attachments} />
                  {item.eventId ? <RelationLink to={`/certificates?eventId=${item.eventId}`}>Event certificates</RelationLink> : null}
                  {item.achievementId ? <RelationLink to={`/certificates?achievementId=${item.achievementId}`}>Certificates</RelationLink> : null}
                </div>
              </ContentCard>
            ))}
          </div>
        ) : (
          <CollectionStatus error={gallery.error} loading={gallery.loading} name="gallery items" />
        )}
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {extracurricular.items.length ? (
          extracurricular.items.slice(0, 2).map((item) => (
            <ContentCard key={item.id} eyebrow={item.category || 'Activity'} title={item.title || 'Untitled activity'}>
              <p>{item.summary}</p>
            </ContentCard>
          ))
        ) : (
          <CollectionStatus error={extracurricular.error} loading={extracurricular.loading} name="extracurricular items" />
        )}
      </section>

      <section className="mt-14 rounded-lg border border-white/12 bg-slate-950/86 p-6 text-white shadow-[0_26px_70px_rgba(2,6,23,0.35)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8dfa6]">Contact</p>
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
