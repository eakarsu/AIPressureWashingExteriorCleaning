import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function GenericFeature({ title, apiEndpoint, columns, formFields, icon }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit', 'create'
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(apiEndpoint);
      const data = Array.isArray(res.data) ? res.data : res.data.data || res.data.items || [];
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    const initial = {};
    formFields.forEach((f) => {
      initial[f.key] = f.defaultValue || '';
    });
    setFormData(initial);
    setModalMode('create');
  };

  const openView = (item) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const openEdit = () => {
    const data = {};
    formFields.forEach((f) => {
      data[f.key] = selectedItem[f.key] !== undefined ? selectedItem[f.key] : '';
    });
    setFormData(data);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
    setFormData({});
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await api.post(apiEndpoint, formData);
      } else if (modalMode === 'edit' && selectedItem) {
        const id = selectedItem._id || selectedItem.id;
        await api.put(`${apiEndpoint}/${id}`, formData);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const id = selectedItem._id || selectedItem.id;
      await api.delete(`${apiEndpoint}/${id}`);
      closeModal();
      fetchItems();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete. Please try again.');
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return columns.some((col) => {
      const val = item[col.key];
      return val && String(val).toLowerCase().includes(lowerSearch);
    });
  });

  const renderFormField = (field) => {
    const value = formData[field.key] || '';
    if (field.type === 'select') {
      return (
        <select value={value} onChange={(e) => handleChange(field.key, e.target.value)}>
          <option value="">Select {field.label}</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label}`}
        />
      );
    }
    return (
      <input
        type={field.type || 'text'}
        value={value}
        onChange={(e) => handleChange(field.key, e.target.value)}
        placeholder={field.placeholder || `Enter ${field.label}`}
      />
    );
  };

  const getDisplayValue = (item, col) => {
    const val = item[col.key];
    if (val === undefined || val === null) return '-';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (col.type === 'date' && val) {
      try { return new Date(val).toLocaleDateString(); } catch { return val; }
    }
    if (col.type === 'currency' && val) return `$${Number(val).toFixed(2)}`;
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
            {title}
          </h1>
        </div>
        <button className="btn btn-success" onClick={openCreate}>
          + Add New
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={{ fontSize: 14, color: '#7986cb' }}>
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading {title.toLowerCase()}...</span>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={columns.length}>
                  No {title.toLowerCase()} found. Click "Add New" to create one.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr key={item._id || item.id || idx} onClick={() => openView(item)}>
                  {columns.map((col) => (
                    <td key={col.key}>{getDisplayValue(item, col)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* View Modal */}
      {modalMode === 'view' && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{title} Details</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {formFields.map((field) => (
                <div className="detail-field" key={field.key}>
                  <div className="detail-label">{field.label}</div>
                  <div className="detail-value">
                    {getDisplayValue(selectedItem, field)}
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              <button className="btn btn-primary btn-sm" onClick={openEdit}>Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? `New ${title}` : `Edit ${title}`}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {formFields.map((field) => (
                <div className="form-group" key={field.key}>
                  <label>{field.label}</label>
                  {renderFormField(field)}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={closeModal}>Cancel</button>
              <button className="btn btn-success btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenericFeature;
