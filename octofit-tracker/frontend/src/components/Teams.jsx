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

function Teams() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/teams/`, [])

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to load teams: ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItems(payload))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error while loading teams')
      } finally {
        setLoading(false)
      }
    }

    void loadTeams()
  }, [apiUrl])

  if (loading) return <p className="text-muted">Loading teams...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        <p className="text-muted small mb-3">Endpoint: {apiUrl}</p>
        {items.length === 0 ? (
          <p className="text-muted">No teams found.</p>
        ) : (
          <div className="row g-3">
            {items.map((team) => (
              <div className="col-md-6" key={team._id ?? team.name}>
                <div className="border rounded p-3 h-100">
                  <h3 className="h5">{team.name ?? 'Unnamed team'}</h3>
                  <p className="text-muted">{team.description ?? 'No description available.'}</p>
                  <p className="mb-0">
                    Members: {Array.isArray(team.memberIds) ? team.memberIds.length : 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Teams
