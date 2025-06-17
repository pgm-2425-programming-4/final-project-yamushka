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

export default function ProjectPage() {
  const { documentId } = useParams({ strict: false });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Haal eerst het project op om het numerieke ID te krijgen
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
  tasks?.forEach(task => {
    if (task) {
      const status = task.taskStatus?.statusName || 'Backlog';

      // Sla backlog taken over, laat alleen taken in andere kolommen zien
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
          <Link to={`/projects/${documentId}/backlog`} className="btn btn-secondary">
            Backlog
          </Link>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Nieuwe Taak
          </button>
        </div>
      </div>

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
