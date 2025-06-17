// Gedeelde loading component
export const LoadingSpinner = ({ message = 'Laden...' }) => (
  <div className="loading-state">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

// Gedeelde error component
export const ErrorMessage = ({ message = 'Er is een fout opgetreden' }) => (
  <div className="error-state">
    <p>{message}</p>
  </div>
);

// Gedeelde empty state component
export const EmptyState = ({ title, message }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

// Gedeelde empty column component specifiek voor kanban kolommen
export const EmptyColumn = ({ message }) => (
  <div className="empty-column">
    <p>{message}</p>
  </div>
);
