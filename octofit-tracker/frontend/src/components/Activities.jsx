import { useEffect, useMemo, useState } from 'react'

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
}

const normalizeItems = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

function Activities() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/activities/`, [])

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to load activities: ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItems(payload))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error while loading activities')
      } finally {
        setLoading(false)
      }
    }

    void loadActivities()
  }, [apiUrl])

  if (loading) return <p className="text-muted">Loading activities...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <p className="text-muted small mb-3">Endpoint: {apiUrl}</p>
        {items.length === 0 ? (
          <p className="text-muted">No activities found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration (min)</th>
                  <th>Calories</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {items.map((activity) => (
                  <tr key={activity._id ?? `${activity.type}-${activity.completedAt}`}>
                    <td>{activity.type ?? 'N/A'}</td>
                    <td>{activity.durationMinutes ?? 'N/A'}</td>
                    <td>{activity.caloriesBurned ?? 'N/A'}</td>
                    <td>
                      {activity.completedAt
                        ? new Date(activity.completedAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Activities
