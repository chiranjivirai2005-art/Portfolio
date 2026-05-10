import { useSearchParams } from 'react-router-dom'
import AttachmentLinks from '../components/AttachmentLinks.jsx'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import RelationLink from '../components/RelationLink.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { CollectionStatus } from '../services/collectionStatus.jsx'
import { getActiveFilters, hasActiveFilters, itemMatchesFilters } from '../services/relations.js'
import { useCollectionItems } from '../services/useCollectionItems.js'

function Achievements() {
  const [searchParams] = useSearchParams()
  const filters = getActiveFilters(searchParams)
  const hasFilters = hasActiveFilters(filters)
  const { error, items, loading } = useCollectionItems('achievements')
  const visibleItems = hasFilters ? items.filter((item) => itemMatchesFilters(item, filters)) : items

  return (
    <PageTransition>
      <SectionHeader
        kicker="Milestones"
        title="Achievements"
        description="Each achievement stores relationship IDs for linked courses, certificates, and gallery items."
      />
      {visibleItems.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleItems.map((item) => (
            <ContentCard
              actions={
                <>
                  {item.courseId ? <RelationLink to={`/courses?id=${item.courseId}`}>Course</RelationLink> : null}
                  <RelationLink to={`/certificates?achievementId=${item.id}`}>Certificates</RelationLink>
                  <RelationLink to={`/gallery?achievementId=${item.id}`}>Gallery</RelationLink>
                  <AttachmentLinks attachments={item.attachments} />
                </>
              }
              highlighted={hasFilters}
              key={item.id}
              eyebrow={`${item.category || 'Achievement'} / ${item.year || 'Year'}`}
              title={item.title || 'Untitled achievement'}
            >
              <p>{item.summary}</p>
              {item.courseId ? <p className="mt-3 font-medium text-slate-400">Course ID: {item.courseId}</p> : null}
            </ContentCard>
          ))}
        </div>
      ) : (
        <CollectionStatus error={error} loading={loading} name="achievements" />
      )}
    </PageTransition>
  )
}

export default Achievements
