import { useEffect, useState } from 'react';

function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      try {
        const apiBaseUrl = import.meta.env.VITE_CODESPACE_NAME
          ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
          : 'http://localhost:8000';
        const resourceUrl = `${apiBaseUrl}/api/activities/`;
        const response = await fetch(resourceUrl);

        if (!response.ok) {
          throw new Error('Unable to load activities');
        }

        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload?.results || payload?.items || payload?.data || [payload];

        if (!ignore) {
          setItems(rows);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load activities');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="text-muted mb-0">Recent movement and workout activity records.</p>
        </div>
        <span className="badge bg-info text-dark">{items.length} records</span>
      </div>

      {loading && <p className="text-muted">Loading activities…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="list-group">
          {items.map((activity) => (
            <article key={activity.id || activity._id} className="list-group-item list-group-item-action">
              <div className="d-flex justify-content-between gap-3">
                <div>
                  <h3 className="h6 mb-1">{activity.type || 'Activity'}</h3>
                  <p className="mb-1 text-muted">{activity.notes || 'No note available'}</p>
                </div>
                <span className="text-muted">{activity.duration ? `${activity.duration} min` : '—'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Activities;
