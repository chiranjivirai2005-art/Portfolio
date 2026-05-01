import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { dummyCertificates } from '../services/portfolioData.js'

function Certificates() {
  return (
    <PageTransition>
      <SectionHeader
        kicker="Proof"
        title="Certificates"
        description="Certificates link back to courses and achievements through document ID fields."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {dummyCertificates.map((item) => (
          <ContentCard key={item.id} eyebrow={`${item.issuer} / ${item.year}`} title={item.title}>
            <p>Course ID: {item.courseId}</p>
            <p>Achievement ID: {item.achievementId}</p>
            {item.fileUrl ? <a className="mt-3 inline-block font-semibold" href={item.fileUrl}>View file</a> : null}
          </ContentCard>
        ))}
      </div>
    </PageTransition>
  )
}

export default Certificates
