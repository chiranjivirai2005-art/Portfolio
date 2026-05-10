import { useSearchParams } from 'react-router-dom'
import AttachmentLinks from '../components/AttachmentLinks.jsx'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import RelationLink from '../components/RelationLink.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { CollectionStatus } from '../services/collectionStatus.jsx'
import { getActiveFilters, getPrimaryImageUrl, hasActiveFilters, itemMatchesFilters } from '../services/relations.js'
import { useCollectionItems } from '../services/useCollectionItems.js'

function Gallery() {
  const [searchParams] = useSearchParams()
  const filters = getActiveFilters(searchParams)
  const hasFilters = hasActiveFilters(filters)
  const { error, items, loading } = useCollectionItems('gallery')
  const visibleItems = hasFilters ? items.filter((item) => itemMatchesFilters(item, filters)) : items

  return (
    <PageTransition>
      <SectionHeader
        kicker="Moments"
        title="Gallery"
        description="Gallery documents reference achievement IDs and event IDs instead of nested event objects."
      />
      {visibleItems.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <ContentCard
              actions={
                <>
                  {getPrimaryImageUrl(item) ? <RelationLink external to={getPrimaryImageUrl(item)}>Open image</RelationLink> : null}
                  <AttachmentLinks attachments={item.attachments} />
                  {item.achievementId ? <RelationLink to={`/achievements?id=${item.achievementId}`}>Achievement</RelationLink> : null}
                  {item.eventId ? <RelationLink to={`/certificates?eventId=${item.eventId}`}>Event certificates</RelationLink> : null}
                  {item.achievementId ? <RelationLink to={`/certificates?achievementId=${item.achievementId}`}>Certificates</RelationLink> : null}
                </>
              }
              highlighted={hasFilters}
              key={item.id}
              imageUrl={getPrimaryImageUrl(item)}
              title={item.title || 'Untitled gallery item'}
            >
              {item.achievementId ? <p>Achievement ID: {item.achievementId}</p> : null}
              {item.eventId ? <p>Event ID: {item.eventId}</p> : null}
            </ContentCard>
          ))}
        </div>
      ) : (
        <CollectionStatus error={error} loading={loading} name="gallery items" />
      )}
    </PageTransition>
  )
}

export default Gallery
