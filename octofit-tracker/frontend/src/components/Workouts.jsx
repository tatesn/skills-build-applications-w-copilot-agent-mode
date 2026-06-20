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

function Workouts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/workouts/`, [])

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to load workouts: ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItems(payload))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error while loading workouts')
      } finally {
        setLoading(false)
      }
    }

    void loadWorkouts()
  }, [apiUrl])

  if (loading) return <p className="text-muted">Loading workouts...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        <p className="text-muted small mb-3">Endpoint: {apiUrl}</p>
        {items.length === 0 ? (
          <p className="text-muted">No workouts found.</p>
        ) : (
          <div className="row g-3">
            {items.map((workout) => (
              <div className="col-md-6" key={workout._id ?? workout.title}>
                <article className="border rounded p-3 h-100">
                  <h3 className="h5">{workout.title ?? 'Untitled workout'}</h3>
                  <p className="mb-1">
                    <strong>Focus:</strong> {workout.focusArea ?? 'N/A'}
                  </p>
                  <p className="mb-1 text-capitalize">
                    <strong>Difficulty:</strong> {workout.difficulty ?? 'N/A'}
                  </p>
                  <p className="mb-2">
                    <strong>Duration:</strong> {workout.durationMinutes ?? 'N/A'} minutes
                  </p>
                  <ul className="mb-0">
                    {(workout.instructions ?? []).map((step, index) => (
                      <li key={`${workout._id ?? workout.title}-${index}`}>{step}</li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Workouts
