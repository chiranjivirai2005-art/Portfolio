import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { dummyGallery } from '../services/portfolioData.js'

function Gallery() {
  return (
    <PageTransition>
      <SectionHeader
        kicker="Moments"
        title="Gallery"
        description="Gallery documents reference achievement IDs and event IDs instead of nested event objects."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {dummyGallery.map((item) => (
          <ContentCard key={item.id} imageUrl={item.imageUrl} title={item.title}>
            <p>Achievement ID: {item.achievementId}</p>
            <p>Event ID: {item.eventId}</p>
          </ContentCard>
        ))}
      </div>
    </PageTransition>
  )
}

export default Gallery
