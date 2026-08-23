import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import './FilterSidebar.css';

const DOMAINS = ['Full-Stack', 'Machine Learning', 'Data Science', 'Frontend', 'Backend', 'DevOps', 'Mobile Development', 'Cybersecurity', 'Cloud Computing', 'UI/UX Design'];
const LOCATIONS = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Remote'];

export default function FilterSidebar({ filters, onChange }) {
  const { domain, location, minStipend, minMatch, sortBy } = filters;

  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  const clearAll = () => onChange({
    domain: '', location: '', minStipend: 0, minMatch: 0, sortBy: 'match'
  });

  const hasFilters = domain || location || minStipend > 0 || minMatch > 0;

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <div className="filter-sidebar__title">
          <SlidersHorizontal size={18} />
          Filters
        </div>
        {hasFilters && (
          <button className="filter-sidebar__clear" onClick={clearAll}>
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${sortBy === 'match' ? 'active' : ''}`}
            onClick={() => handleChange('sortBy', 'match')}
          >Best Match</button>
          <button
            className={`filter-tab ${sortBy === 'stipend' ? 'active' : ''}`}
            onClick={() => handleChange('sortBy', 'stipend')}
          >Highest Stipend</button>
        </div>
      </div>

      {/* Domain */}
      <div className="filter-group">
        <label className="filter-label">Domain</label>
        <select
          className="form-input form-select"
          value={domain}
          onChange={e => handleChange('domain', e.target.value)}
        >
          <option value="">All Domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Location */}
      <div className="filter-group">
        <label className="filter-label">Location</label>
        <select
          className="form-input form-select"
          value={location}
          onChange={e => handleChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Min Stipend */}
      <div className="filter-group">
        <label className="filter-label">
          Min Stipend <span className="filter-value">₹{(minStipend || 0).toLocaleString()}/mo</span>
        </label>
        <input
          type="range"
          min="0"
          max="50000"
          step="1000"
          value={minStipend || 0}
          onChange={e => handleChange('minStipend', Number(e.target.value))}
          className="filter-range"
        />
        <div className="filter-range-labels">
          <span>₹0</span>
          <span>₹50K</span>
        </div>
      </div>

      {/* Min Match */}
      <div className="filter-group">
        <label className="filter-label">
          Min Match % <span className="filter-value">{minMatch || 0}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={minMatch || 0}
          onChange={e => handleChange('minMatch', Number(e.target.value))}
          className="filter-range"
        />
        <div className="filter-range-labels">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </aside>
  );
}
