import { useState } from 'react';
import { useFormData } from '../hooks/useFormData';

export default function TaskFilter({ onFilterChange, activeFilters }) {
  const [showFilters, setShowFilters] = useState(false);
  const { statuses, labels } = useFormData();

  const handleStatusFilter = statusId => {
    const currentStatusFilters = activeFilters.statuses || [];
    const newStatusFilters = currentStatusFilters.includes(statusId)
      ? currentStatusFilters.filter(id => id !== statusId)
      : [...currentStatusFilters, statusId];

    onFilterChange({
      ...activeFilters,
      statuses: newStatusFilters,
    });
  };

  const handleLabelFilter = labelId => {
    const currentLabelFilters = activeFilters.labels || [];
    const newLabelFilters = currentLabelFilters.includes(labelId)
      ? currentLabelFilters.filter(id => id !== labelId)
      : [...currentLabelFilters, labelId];

    onFilterChange({
      ...activeFilters,
      labels: newLabelFilters,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({ statuses: [], labels: [] });
  };

  const hasActiveFilters = activeFilters.statuses?.length > 0 || activeFilters.labels?.length > 0;

  return (
    <div className="task-filter">
      <div className="filter-header">
        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          Filters{' '}
          {hasActiveFilters &&
            `(${(activeFilters.statuses?.length || 0) + (activeFilters.labels?.length || 0)})`}
        </button>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Wis Filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filter-content">
          <div className="filter-section">
            <h4>Status</h4>
            <div className="filter-buttons">
              {statuses?.map(status => (
                <button
                  key={status.id}
                  className={`filter-btn ${activeFilters.statuses?.includes(status.id) ? 'active' : ''}`}
                  onClick={() => handleStatusFilter(status.id)}
                >
                  {status.statusName}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Labels</h4>
            <div className="filter-buttons">
              {labels?.map(label => (
                <button
                  key={label.id}
                  className={`filter-btn ${activeFilters.labels?.includes(label.id) ? 'active' : ''}`}
                  onClick={() => handleLabelFilter(label.id)}
                  style={{
                    backgroundColor: activeFilters.labels?.includes(label.id)
                      ? label.color
                      : 'transparent',
                    borderColor: label.color,
                  }}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
