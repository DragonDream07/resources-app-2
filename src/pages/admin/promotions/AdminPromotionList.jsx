import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminPromotionList() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPromoCodes() {
      try {
        const res = await fetch('/api/promo-codes', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch promo codes');
        const data = await res.json();
        setPromoCodes(data.data ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPromoCodes();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      const res = await fetch(`/api/promo-codes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete promo code');
      setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="admin-promotion-list">
      <div className="admin-promotion-list__header">
        <h1 className="admin-promotion-list__title">Promo Codes</h1>
        <Link to="/admin/promotions/new" className="admin-promotion-list__new-btn">
          <img src="/src/assets/icons/plus.svg" alt="" className="admin-promotion-list__new-btn-icon" />
          New Promo Code
        </Link>
      </div>

      {loading && <p className="admin-promotion-list__loading">Loading promo codes…</p>}
      {error && <p className="admin-promotion-list__error">{error}</p>}

      {!loading && !error && (
        <div className="admin-promotion-list__table-wrapper">
          <table className="admin-promotion-list__table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Expiry</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-promotion-list__empty">
                    No promo codes found.
                  </td>
                </tr>
              )}
              {promoCodes.map((promo) => (
                <tr key={promo.id} className="admin-promotion-list__row">
                  <td className="admin-promotion-list__code">{promo.code}</td>
                  <td>{promo.discount_type}</td>
                  <td>
                    {promo.discount_type === 'percentage'
                      ? `${promo.discount_value}%`
                      : `₹${promo.discount_value}`}
                  </td>
                  <td>{promo.min_order_value != null ? `₹${promo.min_order_value}` : '—'}</td>
                  <td>
                    {promo.expires_at
                      ? new Date(promo.expires_at).toLocaleDateString()
                      : '—'}
                  </td>
                  <td>
                    <span
                      className={`admin-promotion-list__status ${
                        promo.is_active
                          ? 'admin-promotion-list__status--active'
                          : 'admin-promotion-list__status--inactive'
                      }`}
                    >
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="admin-promotion-list__actions">
                    <Link
                      to={`/admin/promotions/${promo.id}/edit`}
                      className="admin-promotion-list__edit-btn"
                      aria-label={`Edit ${promo.code}`}
                    >
                      <img src="/src/assets/icons/edit.svg" alt="Edit" />
                    </Link>
                    <button
                      type="button"
                      className="admin-promotion-list__delete-btn"
                      aria-label={`Delete ${promo.code}`}
                      onClick={() => handleDelete(promo.id)}
                    >
                      <img src="/src/assets/icons/trash.svg" alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
