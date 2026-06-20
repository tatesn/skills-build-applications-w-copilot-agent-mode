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

function Users() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/users/`, [])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to load users: ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItems(payload))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error while loading users')
      } finally {
        setLoading(false)
      }
    }

    void loadUsers()
  }, [apiUrl])

  if (loading) return <p className="text-muted">Loading users...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <p className="text-muted small mb-3">Endpoint: {apiUrl}</p>
        {items.length === 0 ? (
          <p className="text-muted">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Fitness Level</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user._id ?? user.email}>
                    <td>{user.name ?? 'N/A'}</td>
                    <td>{user.email ?? 'N/A'}</td>
                    <td className="text-capitalize">{user.fitnessLevel ?? 'N/A'}</td>
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

export default Users
