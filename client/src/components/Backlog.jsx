import React from "react";

function Backlog() {
  return (
    <main className="main-content">
      <section className="backlog-view active">
        <div className="backlog-container">
          <div className="backlog-header">
            <h2 className="backlog-title">Project Backlog</h2>
            <div className="backlog-controls">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tasks..."
                />
              </div>
              <button className="filter-btn">Filter</button>
            </div>
          </div>
          <table className="backlog-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Tags</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Tutaj będą dynamiczne wiersze zadań z backendu */}
            </tbody>
          </table>
          <div className="pagination">
            <div className="pagination-info">Showing 1 to 7 of 7 tasks</div>
            <div className="pagination-controls">
              <button className="pagination-btn">←</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">→</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Backlog;
