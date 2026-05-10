import AttachmentLinks from '../components/AttachmentLinks.jsx'
import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { CollectionStatus } from '../services/collectionStatus.jsx'
import { useCollectionItems } from '../services/useCollectionItems.js'

function Extracurricular() {
  const { error, items, loading } = useCollectionItems('extracurricular')

  return (
    <PageTransition>
      <SectionHeader
        kicker="Beyond class"
        title="Extracurricular"
        description="A concise view of community, leadership, and communication work."
      />
      {items.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <ContentCard
              actions={<AttachmentLinks attachments={item.attachments} />}
              key={item.id}
              highlighted={false}
              eyebrow={item.category || 'Activity'}
              title={item.title || 'Untitled activity'}
            >
              <p>{item.summary}</p>
            </ContentCard>
          ))}
        </div>
      ) : (
        <CollectionStatus error={error} loading={loading} name="extracurricular items" />
      )}
    </PageTransition>
  )
}

export default Extracurricular
