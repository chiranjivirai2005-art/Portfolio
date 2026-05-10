export function CollectionStatus({ error, loading, name }) {
  if (loading) {
    return (
      <div className="empty-panel rounded-lg p-5 text-slate-300">
        Loading {name} from backend...
      </div>
    )
  }

  if (error) {
    return (
      <div className="empty-panel rounded-lg p-5 text-slate-300">
        Could not load {name}: {error}
      </div>
    )
  }

  return (
    <div className="empty-panel rounded-lg p-5 text-slate-300">
      No {name} have been added from the dashboard yet.
    </div>
  )
}
