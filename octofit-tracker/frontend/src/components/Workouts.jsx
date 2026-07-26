import { useEffect, useState } from 'react';
import { fetchResource } from '../lib/api';

function Workouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadWorkouts() {
      try {
        const rows = await fetchResource('/api/workouts/');
        if (!ignore) {
          setItems(rows);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load workouts');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Workouts</h2>
          <p className="text-muted mb-0">Planned routines and coaching suggestions.</p>
        </div>
        <span className="badge bg-secondary">{items.length} plans</span>
      </div>

      {loading && <p className="text-muted">Loading workouts…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="list-group">
          {items.map((workout) => (
            <article key={workout.id || workout._id} className="list-group-item">
              <h3 className="h6 mb-1">{workout.title || 'Workout plan'}</h3>
              <p className="mb-0 text-muted">{workout.description || 'Focus details will appear here.'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Workouts;
