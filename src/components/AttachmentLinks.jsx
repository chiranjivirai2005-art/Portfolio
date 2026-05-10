import RelationLink from './RelationLink.jsx'

function formatType(type) {
  return String(type || 'file')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getAttachmentLabel(attachment) {
  return attachment.customCategory || formatType(attachment.type)
}

function getPublishedPath(attachment) {
  if (!attachment?.publishedId || !attachment?.publishTo) {
    return ''
  }

  if (!['achievements', 'certificates', 'courses', 'extracurricular', 'gallery'].includes(attachment.publishTo)) {
    return ''
  }

  return `/${attachment.publishTo}?id=${attachment.publishedId}`
}

function AttachmentLinks({ attachments }) {
  const validAttachments = Array.isArray(attachments)
    ? attachments.filter((attachment) => attachment?.url)
    : []

  if (!validAttachments.length) {
    return null
  }

  return (
    <>
      {validAttachments.map((attachment, index) => (
        <span className="contents" key={`${attachment.url}-${index}`}>
          <RelationLink external to={attachment.url}>
            {getAttachmentLabel(attachment)}
          </RelationLink>
          {getPublishedPath(attachment) ? (
            <RelationLink to={getPublishedPath(attachment)}>
              View in section
            </RelationLink>
          ) : null}
        </span>
      ))}
    </>
  )
}

export default AttachmentLinks
