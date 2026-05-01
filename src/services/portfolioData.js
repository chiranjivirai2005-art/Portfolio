export const dummyCourses = [
  {
    id: 'course-react-firebase',
    title: 'React and Firebase Architecture',
    provider: 'Self-directed build',
    year: '2026',
    summary: 'Built production-ready portfolio workflows with auth, Firestore, and media delivery.',
  },
  {
    id: 'course-cloud-dev',
    title: 'Cloud Application Foundations',
    provider: 'Online certification',
    year: '2025',
    summary: 'Studied scalable web apps, secure data rules, and deployment pipelines.',
  },
]

export const dummyAchievements = [
  {
    id: 'achievement-campus-innovation',
    title: 'Campus Innovation Showcase',
    courseId: 'course-react-firebase',
    year: '2026',
    category: 'Development',
    summary: 'Presented a Firebase-backed student portfolio system with admin-managed content.',
    featured: true,
  },
  {
    id: 'achievement-community-tech',
    title: 'Community Tech Sprint',
    courseId: 'course-cloud-dev',
    year: '2025',
    category: 'Leadership',
    summary: 'Led a team building accessible web tools for local organizers.',
    featured: true,
  },
]

export const dummyCertificates = [
  {
    id: 'certificate-react-firebase',
    title: 'React Firebase Project Certificate',
    courseId: 'course-react-firebase',
    achievementId: 'achievement-campus-innovation',
    issuer: 'Project Review Board',
    year: '2026',
    fileUrl: '',
  },
  {
    id: 'certificate-cloud-foundations',
    title: 'Cloud Foundations Completion',
    courseId: 'course-cloud-dev',
    achievementId: 'achievement-community-tech',
    issuer: 'Online Academy',
    year: '2025',
    fileUrl: '',
  },
]

export const dummyGallery = [
  {
    id: 'gallery-showcase',
    title: 'Portfolio Showcase Demo',
    achievementId: 'achievement-campus-innovation',
    eventId: 'event-campus-showcase',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gallery-team-sprint',
    title: 'Team Sprint Planning',
    achievementId: 'achievement-community-tech',
    eventId: 'event-community-sprint',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gallery-certificate-day',
    title: 'Certificate Day',
    achievementId: 'achievement-campus-innovation',
    eventId: 'event-certification',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  },
]

export const dummyExtracurricular = [
  {
    id: 'extra-open-source',
    title: 'Open Source Contributor',
    category: 'Technology',
    summary: 'Contributed documentation, UI fixes, and issue triage to student-friendly projects.',
  },
  {
    id: 'extra-speaking',
    title: 'Technical Speaker',
    category: 'Communication',
    summary: 'Hosted sessions on web fundamentals, Firebase, and practical project planning.',
  },
]

export const collections = {
  courses: dummyCourses,
  achievements: dummyAchievements,
  certificates: dummyCertificates,
  gallery: dummyGallery,
  extracurricular: dummyExtracurricular,
}
