export function getActiveFilters(searchParams) {
  return {
    achievementId: searchParams.get('achievementId') || '',
    courseId: searchParams.get('courseId') || '',
    eventId: searchParams.get('eventId') || '',
    id: searchParams.get('id') || '',
  }
}

export function itemMatchesFilters(item, filters) {
  return Boolean(
    (filters.id && item.id === filters.id) ||
      (filters.courseId && item.courseId === filters.courseId) ||
      (filters.achievementId && item.achievementId === filters.achievementId) ||
      (filters.achievementId && item.id === filters.achievementId) ||
      (filters.eventId && item.eventId === filters.eventId),
  )
}

export function hasActiveFilters(filters) {
  return Object.values(filters).some(Boolean)
}

export function getPrimaryAttachment(item, preferredTypes = []) {
  const attachments = Array.isArray(item.attachments) ? item.attachments : []

  return (
    preferredTypes.map((type) => attachments.find((attachment) => attachment.type === type)).find(Boolean) ||
    attachments[0] ||
    null
  )
}

export function getPrimaryFileUrl(item) {
  return item.fileUrl || getPrimaryAttachment(item, ['certificate', 'document', 'report', 'other'])?.url || ''
}

export function getPrimaryImageUrl(item) {
  return item.imageUrl || getPrimaryAttachment(item, ['gallery-image', 'event-photo', 'project-photo', 'image'])?.url || ''
}
