import { useSearchParams } from 'react-router-dom'
import AttachmentLinks from '../components/AttachmentLinks.jsx'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import RelationLink from '../components/RelationLink.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { CollectionStatus } from '../services/collectionStatus.jsx'
import { getActiveFilters, hasActiveFilters, itemMatchesFilters } from '../services/relations.js'
import { useCollectionItems } from '../services/useCollectionItems.js'

function Courses() {
  const [searchParams] = useSearchParams()
  const filters = getActiveFilters(searchParams)
  const hasFilters = hasActiveFilters(filters)
  const { error, items, loading } = useCollectionItems('courses')
  const visibleItems = hasFilters ? items.filter((item) => itemMatchesFilters(item, filters)) : items

  return (
    <PageTransition>
      <SectionHeader
        kicker="Learning"
        title="Courses"
        description="Courses are top-level documents that can be referenced by certificates and achievements."
      />
      {visibleItems.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleItems.map((item) => (
            <ContentCard
              actions={
                <>
                  <RelationLink to={`/achievements?courseId=${item.id}`}>Achievements</RelationLink>
                  <RelationLink to={`/certificates?courseId=${item.id}`}>Certificates</RelationLink>
                  <AttachmentLinks attachments={item.attachments} />
                </>
              }
              highlighted={hasFilters}
              key={item.id}
              eyebrow={`${item.provider || 'Course'} / ${item.year || 'Year'}`}
              title={item.title || 'Untitled course'}
            >
              <p>{item.summary}</p>
            </ContentCard>
          ))}
        </div>
      ) : (
        <CollectionStatus error={error} loading={loading} name="courses" />
      )}
    </PageTransition>
  )
}

export default Courses
