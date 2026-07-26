import { useEffect, useState } from 'react';

function Leaderboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadLeaderboard() {
      try {
        const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
        const resourceUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
          : 'http://localhost:8000/api/leaderboard/';
        const response = await fetch(resourceUrl);

        if (!response.ok) {
          throw new Error('Unable to load leaderboard');
        }

        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload?.results || payload?.items || payload?.data || [payload];

        if (!ignore) {
          setItems(rows);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load leaderboard');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Leaderboard</h2>
          <p className="text-muted mb-0">Current standings for the most engaged teams.</p>
        </div>
        <span className="badge bg-warning text-dark">{items.length} entries</span>
      </div>

      {loading && <p className="text-muted">Loading leaderboard…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="list-group">
          {items.map((entry, index) => (
            <article key={entry.id || entry._id || `${entry.teamId}-${index}`} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="h6 mb-1">{entry.teamName || entry.teamId || `Rank ${index + 1}`}</h3>
                  <p className="mb-0 text-muted">{entry.score !== undefined ? `${entry.score} points` : 'Score pending'}</p>
                </div>
                <span className="text-muted">#{index + 1}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Leaderboard;
