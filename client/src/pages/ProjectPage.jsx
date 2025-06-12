import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// api functies
import { fetchTasksByProject } from '../api/task/fetchTasks.js';
import { fetchProjectByDocumentId } from '../api/project/fetchProjectById.js';

// componenten
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';

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

  if (projectLoading || isLoading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Laden...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p>Er is een fout opgetreden</p>
      </div>
    );

  if (!project)
    return (
      <div className="error-state">
        <p>Project niet gevonden</p>
      </div>
    );

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="header-content">
          <h2 className="project-title">{project?.name || 'Taakbord'}</h2>
          <p className="project-subtitle">Organiseer je taken</p>
        </div>
        <button className="header-link" onClick={() => setShowForm(true)}>
          Nieuwe Taak
        </button>
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
            {list.length === 0 && (
              <div className="empty-column">
                <div className="desert-scene">
                  <div className="small-dune"></div>
                  <div className="cactus"></div>
                </div>
                <p>Nog geen taken in deze fase</p>
              </div>
            )}
            <div className="task-trail">
              {list.map(task => (
                <div
                  key={task.id}
                  className="kanban-card"
                  onClick={() => {
                    console.log('Task clicked:', task);
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
