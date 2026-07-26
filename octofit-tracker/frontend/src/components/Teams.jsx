import { useEffect, useState } from 'react';
import { fetchResource } from '../lib/api';

function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadTeams() {
      try {
        const rows = await fetchResource('/api/teams/');
        if (!ignore) {
          setItems(rows);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load teams');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Teams</h2>
          <p className="text-muted mb-0">Group activity and collaboration spaces.</p>
        </div>
        <span className="badge bg-success text-light">{items.length} teams</span>
      </div>

      {loading && <p className="text-muted">Loading teams…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="list-group">
          {items.map((team) => (
            <article key={team.id || team._id} className="list-group-item">
              <h3 className="h6 mb-1">{team.name || 'Unnamed team'}</h3>
              <p className="mb-0 text-muted">{team.description || 'Team details coming soon.'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Teams;
