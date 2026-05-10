import { useSearchParams } from 'react-router-dom'
import AttachmentLinks from '../components/AttachmentLinks.jsx'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import RelationLink from '../components/RelationLink.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { CollectionStatus } from '../services/collectionStatus.jsx'
import { getActiveFilters, getPrimaryFileUrl, hasActiveFilters, itemMatchesFilters } from '../services/relations.js'
import { useCollectionItems } from '../services/useCollectionItems.js'

function Certificates() {
  const [searchParams] = useSearchParams()
  const filters = getActiveFilters(searchParams)
  const hasFilters = hasActiveFilters(filters)
  const { error, items, loading } = useCollectionItems('certificates')
  const visibleItems = hasFilters ? items.filter((item) => itemMatchesFilters(item, filters)) : items

  return (
    <PageTransition>
      <SectionHeader
        kicker="Proof"
        title="Certificates"
        description="Certificates link back to courses and achievements through document ID fields."
      />
      {visibleItems.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <ContentCard
              actions={
                <>
                  {getPrimaryFileUrl(item) ? <RelationLink external to={getPrimaryFileUrl(item)}>Open certificate</RelationLink> : null}
                  <AttachmentLinks attachments={item.attachments} />
                  {item.achievementId ? <RelationLink to={`/achievements?id=${item.achievementId}`}>Achievement</RelationLink> : null}
                  {item.courseId ? <RelationLink to={`/courses?id=${item.courseId}`}>Course</RelationLink> : null}
                  {item.eventId ? <RelationLink to={`/gallery?eventId=${item.eventId}`}>Event gallery</RelationLink> : null}
                  {item.achievementId ? <RelationLink to={`/gallery?achievementId=${item.achievementId}`}>Gallery</RelationLink> : null}
                </>
              }
              highlighted={hasFilters}
              key={item.id}
              eyebrow={`${item.issuer || 'Certificate'} / ${item.year || 'Year'}`}
              title={item.title || 'Untitled certificate'}
            >
              {item.courseId ? <p>Course ID: {item.courseId}</p> : null}
              {item.achievementId ? <p>Achievement ID: {item.achievementId}</p> : null}
              {item.eventId ? <p>Event ID: {item.eventId}</p> : null}
            </ContentCard>
          ))}
        </div>
      ) : (
        <CollectionStatus error={error} loading={loading} name="certificates" />
      )}
    </PageTransition>
  )
}

export default Certificates
