import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { dummyExtracurricular } from '../services/portfolioData.js'

function Extracurricular() {
  return (
    <PageTransition>
      <SectionHeader
        kicker="Beyond class"
        title="Extracurricular"
        description="A concise view of community, leadership, and communication work."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {dummyExtracurricular.map((item) => (
          <ContentCard key={item.id} eyebrow={item.category} title={item.title}>
            <p>{item.summary}</p>
          </ContentCard>
        ))}
      </div>
    </PageTransition>
  )
}

export default Extracurricular
