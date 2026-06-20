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

function Leaderboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/leaderboard/`, [])

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to load leaderboard: ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItems(payload))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error while loading leaderboard')
      } finally {
        setLoading(false)
      }
    }

    void loadLeaderboard()
  }, [apiUrl])

  if (loading) return <p className="text-muted">Loading leaderboard...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <p className="text-muted small mb-3">Endpoint: {apiUrl}</p>
        {items.length === 0 ? (
          <p className="text-muted">No leaderboard entries found.</p>
        ) : (
          <ol className="list-group list-group-numbered">
            {items.map((entry) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={entry._id ?? `${entry.rank}-${entry.points}`}
              >
                <span>{entry.userId?.name ?? 'Unknown user'}</span>
                <span>
                  Rank {entry.rank ?? '-'} | {entry.points ?? 0} pts
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
