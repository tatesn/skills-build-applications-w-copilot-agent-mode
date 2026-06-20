import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const navItems = [
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  const apiBase = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="display-6 mb-2">OctoFit Tracker</h1>
        <p className="text-muted mb-2">
          Presentation tier configured for React 19 + react-router-dom.
        </p>
        <div className="alert alert-info mb-0" role="alert">
          Define <strong>VITE_CODESPACE_NAME</strong> (for example in <code>.env.local</code>)
          {' '}to target Codespaces API URLs. If it is unset, the app safely falls back to
          {' '}<code>http://localhost:8000/api</code>.
        </div>
      </header>

      <section className="mb-4">
        <p className="small text-muted mb-2">Current API base: {apiBase}</p>
        <nav className="nav nav-pills flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : 'link-primary'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </section>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
