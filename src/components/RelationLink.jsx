import { Link } from 'react-router-dom'

function RelationLink({ children, external = false, to }) {
  if (!to) {
    return null
  }

  if (external) {
    return (
      <a className="relation-link" href={to} rel="noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link className="relation-link" to={to}>
      {children}
    </Link>
  )
}

export default RelationLink
