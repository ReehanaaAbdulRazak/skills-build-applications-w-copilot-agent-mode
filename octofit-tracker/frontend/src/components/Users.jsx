import { useEffect, useState } from 'react';

function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
        const resourceUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';
        const response = await fetch(resourceUrl);

        if (!response.ok) {
          throw new Error('Unable to load users');
        }

        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload?.results || payload?.items || payload?.data || [payload];

        if (!ignore) {
          setItems(rows);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load users');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="text-muted mb-0">Members and their access roles.</p>
        </div>
        <span className="badge bg-primary">{items.length} users</span>
      </div>

      {loading && <p className="text-muted">Loading users…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="list-group">
          {items.map((user) => (
            <article key={user.id || user._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h3 className="h6 mb-1">{user.name || 'Anonymous user'}</h3>
                  <p className="mb-0 text-muted">{user.email || 'Email unavailable'}</p>
                </div>
                <span className="badge bg-light text-dark">{user.role || 'member'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Users;
