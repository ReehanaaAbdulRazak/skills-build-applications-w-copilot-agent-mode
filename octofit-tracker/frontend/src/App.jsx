import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import { getApiBaseUrl } from './lib/api';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
];

function App() {
  const apiBaseUrl = getApiBaseUrl();

  return (
    <main className="app-shell py-4">
      <section className="card shadow-lg border-0">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <span className="badge bg-info-subtle text-info-emphasis">OctoFit Tracker</span>
            <h1 className="display-6 mt-3 mb-2">Modern fitness tracking for ambitious teams</h1>
            <p className="text-muted mb-0">
              Manage workouts, leaderboards, and team challenges from a polished multi-tier app built with React, Express, and MongoDB.
            </p>
          </div>
          <div className="text-start text-md-end">
            <p className="mb-1 fw-semibold">API base URL</p>
            <p className="small text-muted mb-0">{apiBaseUrl}</p>
            <p className="small text-muted mt-2">Set VITE_CODESPACE_NAME in .env.local for Codespaces support.</p>
          </div>
        </div>

        <nav className="nav nav-pills flex-wrap gap-2 mb-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Routes>
          <Route path="/" element={<section className="row g-3"><div className="col-12 col-lg-6"><Users /></div><div className="col-12 col-lg-6"><Teams /></div></section>} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </section>
    </main>
  );
}

export default App;
