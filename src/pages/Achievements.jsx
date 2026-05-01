import ContentCard from '../components/ContentCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { dummyAchievements } from '../services/portfolioData.js'

function Achievements() {
  return (
    <PageTransition>
      <SectionHeader
        kicker="Milestones"
        title="Achievements"
        description="Each achievement stores relationship IDs for linked courses, certificates, and gallery items."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {dummyAchievements.map((item) => (
          <ContentCard key={item.id} eyebrow={`${item.category} / ${item.year}`} title={item.title}>
            <p>{item.summary}</p>
            <p className="mt-3 font-medium text-slate-500">Course ID: {item.courseId}</p>
          </ContentCard>
        ))}
      </div>
    </PageTransition>
  )
}

export default Achievements
