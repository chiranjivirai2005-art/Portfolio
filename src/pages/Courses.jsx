import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { dummyCourses } from '../services/portfolioData.js'

function Courses() {
  return (
    <PageTransition>
      <SectionHeader
        kicker="Learning"
        title="Courses"
        description="Courses are top-level documents that can be referenced by certificates and achievements."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {dummyCourses.map((item) => (
          <ContentCard key={item.id} eyebrow={`${item.provider} / ${item.year}`} title={item.title}>
            <p>{item.summary}</p>
          </ContentCard>
        ))}
      </div>
    </PageTransition>
  )
}

export default Courses
