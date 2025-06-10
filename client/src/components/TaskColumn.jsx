import React from 'react';

function TaskColumn({ status, title, tasks, isLoading, onTaskClick }) {

  if (isLoading) {
    return (
      <div className={`kanban-column ${status}`}>
        <div className="column-header">
          <div className="column-title">{title}</div>
          <div className="task-count">0</div>
        </div>
        <div className="column-body">
          <p>Loading...</p>
        </div>
      </div>
    );
  }


  if (tasks.length === 0) {
    return (
      <div className={`kanban-column ${status}`}>
        <div className="column-header">
          <div className="column-title">{title}</div>
          <div className="task-count">0</div>
        </div>
        <div className="column-body">
          <p style={{ opacity: 0.6 }}>Geen taken</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`kanban-column ${status}`}>
      <div className="column-header">
        <div className="column-title">{title}</div>
        <div className="task-count">{tasks.length}</div>
      </div>
      <div className="column-body">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} status={status} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, status, onClick }) {

  if (!task || !task.attributes) {
    return null;
  }

  const taskTitle = task.attributes.taskTitle || task.attributes.title || 'Untitled Task';
  const statusName = task.attributes?.taskStatus?.data?.attributes?.statusName || 'Geen status';


  return (
    <div
      className="task-card"
      style={{ '--task-color': `var(--status-${status})` }}
      onClick={onClick}
    >
      <div className="task-header">
        <h3 className="task-title">{taskTitle}</h3>
      </div>
      <div className="task-meta">
        <div className="task-status">Status: {statusName}</div>
        {task.attributes?.tags?.data?.map(tag => (
          <span key={tag.id} className={`task-tag ${tag.attributes?.name?.toLowerCase() || ''}`}>
            <span className="tag-dot"></span>
            {tag.attributes?.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;
