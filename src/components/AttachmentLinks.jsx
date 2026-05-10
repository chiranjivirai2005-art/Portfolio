import RelationLink from './RelationLink.jsx'

function formatType(type) {
  return String(type || 'file')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
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
        <RelationLink
          external
          key={`${attachment.url}-${index}`}
          to={attachment.url}
        >
          {formatType(attachment.type)}
        </RelationLink>
      ))}
    </>
  )
}

export default AttachmentLinks
