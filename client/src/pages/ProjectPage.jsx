import { useParams, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// api functies
import { fetchTasksByProject } from '../api/task/fetchTasks.js';
import { fetchProjectByDocumentId } from '../api/project/fetchProjectById.js';

// componenten
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';
import { LoadingSpinner, ErrorMessage, EmptyState, EmptyColumn } from '../components/shared/States';
import { useFormData } from '../hooks/useFormData';

export default function ProjectPage() {
  const { documentId } = useParams({ strict: false });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ statuses: [], labels: [] });
  const [showFilters, setShowFilters] = useState(false);
  const { statuses, labels } = useFormData();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', documentId],
    queryFn: () => fetchProjectByDocumentId(documentId),
    enabled: !!documentId,
  });

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', documentId],
    queryFn: () => fetchTasksByProject(documentId),
    enabled: !!documentId,
  });

  const grouped = {
    Todo: [],
    'In progress': [],
    'In review': [],
    Done: [],
  };

  const shouldShowTask = task => {
    if (!task) return false;

    const hasStatusFilters = filters.statuses && filters.statuses.length > 0;
    const hasLabelFilters = filters.labels && filters.labels.length > 0;

    if (!hasStatusFilters && !hasLabelFilters) return true;

    const passesStatusFilter = !hasStatusFilters || filters.statuses.includes(task.taskStatus?.id);

    const passesLabelFilter =
      !hasLabelFilters ||
      (task.labels && task.labels.some(label => filters.labels.includes(label.id)));

    return passesStatusFilter && passesLabelFilter;
  };

  tasks?.forEach(task => {
    if (task && shouldShowTask(task)) {
      const status = task.taskStatus?.statusName || 'Backlog';

      if (status !== 'Backlog' && grouped[status]) {
        grouped[status].push(task);
      }
    }
  });

  if (projectLoading || isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Er is een fout opgetreden" />;
  if (!project) return <ErrorMessage message="Project niet gevonden" />;

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="header-left">
          <div className="header-content">
            <h2 className="project-title">{project?.name || 'Taakbord'}</h2>
            <p className="project-subtitle">Organiseer je taken</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
            Filters{' '}
            {(filters.statuses?.length > 0 || filters.labels?.length > 0) &&
              `(${(filters.statuses?.length || 0) + (filters.labels?.length || 0)})`}
          </button>
          <Link to={`/projects/${documentId}/backlog`} className="btn btn-secondary">
            Backlog
          </Link>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Nieuwe Taak
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-content">
          <div className="filter-section">
            <h4>Status</h4>
            <div className="filter-buttons">
              {statuses?.map(status => (
                <button
                  key={status.id}
                  className={`filter-btn ${filters.statuses?.includes(status.id) ? 'active' : ''}`}
                  onClick={() => {
                    const currentStatusFilters = filters.statuses || [];
                    const newStatusFilters = currentStatusFilters.includes(status.id)
                      ? currentStatusFilters.filter(id => id !== status.id)
                      : [...currentStatusFilters, status.id];

                    setFilters({
                      ...filters,
                      statuses: newStatusFilters,
                    });
                  }}
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
                  className={`filter-btn ${filters.labels?.includes(label.id) ? 'active' : ''}`}
                  onClick={() => {
                    const currentLabelFilters = filters.labels || [];
                    const newLabelFilters = currentLabelFilters.includes(label.id)
                      ? currentLabelFilters.filter(id => id !== label.id)
                      : [...currentLabelFilters, label.id];

                    setFilters({
                      ...filters,
                      labels: newLabelFilters,
                    });
                  }}
                  style={{
                    backgroundColor: filters.labels?.includes(label.id)
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

          {(filters.statuses?.length > 0 || filters.labels?.length > 0) && (
            <button
              className="clear-filters-btn"
              onClick={() => setFilters({ statuses: [], labels: [] })}
            >
              Wis Filters
            </button>
          )}
        </div>
      )}

      {showForm && project && (
        <div className="form-overlay">
          <TaskForm
            projectId={project.id}
            projectDocumentId={documentId}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {selectedTask && <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />}

      <div className="kanban-board">
        {Object.entries(grouped).map(([status, list]) => (
          <div key={status} className="kanban-column">
            <h3 className="column-title">{status}</h3>
            {list.length === 0 && <EmptyColumn message="Nog geen taken in deze fase" />}
            <div className="task-trail">
              {list.map(task => (
                <div
                  key={task.id}
                  className="kanban-card"
                  onClick={() => {
                    setSelectedTask(task);
                  }}
                >
                  <div className="card-marker"></div>
                  <h4>{task.taskTitle}</h4>
                  <p>
                    {!task.taskDescription
                      ? 'Geen beschrijving'
                      : typeof task.taskDescription === 'string'
                        ? task.taskDescription
                        : 'Klik om beschrijving te bekijken'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
