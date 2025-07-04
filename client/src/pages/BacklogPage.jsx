import { useParams, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

//  api functies
import { fetchTasksByProject } from '../api/task/fetchTasks.js';
import { fetchProjectByDocumentId } from '../api/project/fetchProjectById.js';

// componenten
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';
import Pagination from '../components/Pagination';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/shared/States';

// Styling
import '../styles/main.css';

export default function BacklogPage() {
  const { documentId } = useParams({ strict: false });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const backlogTasks = tasks?.filter(task => {
    if (!task) return false;

    // Alleen taken met status "Backlog" tonen
    const status = task.taskStatus?.statusName;
    const isForCurrentProject = task.project?.id === project?.id;

    // Alleen taken met status "Backlog" en van het huidige project
    return status === 'Backlog' && isForCurrentProject;
  });

  const totalBacklogTasks = backlogTasks?.length || 0;
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = backlogTasks?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  if (projectLoading || isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Er is een fout opgetreden" />;
  if (!project) return <ErrorMessage message="Project niet gevonden" />;

  return (
    <div className="backlog-container">
      <div className="project-header">
        <div className="header-left">
          <div className="header-content">
            <h2 className="project-title">{project?.name || 'Project'} - Backlog</h2>
            <p className="project-subtitle">Taken in de backlog</p>
            <div className="backlog-stats">
              <div className="stat-marker"></div>
              <span className="task-count">{totalBacklogTasks} taken</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <Link to={`/projects/${documentId}`} className="btn btn-secondary">
            Kanban Board
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

      <div className="backlog-tasks">
        {totalBacklogTasks === 0 && (
          <EmptyState title="BACKLOG IS LEEG" message="GEEN TAKEN IN DE BACKLOG" />
        )}
        <div className="task-caravan">
          {currentItems.map(task => (
            <div key={task.id} className="backlog-task-card" onClick={() => setSelectedTask(task)}>
              <div className="card-marker"></div>
              <div className="task-content">
                <h4>{task.taskTitle}</h4>
                <p>
                  {!task.taskDescription || task.taskDescription.trim() === ''
                    ? 'Geen beschrijving'
                    : task.taskDescription}
                </p>
                <div className="task-meta">
                  <div className="task-status">
                    <div className="status-marker"></div>
                    <span>{task.taskStatus?.statusName || 'Geen status'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalBacklogTasks > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalBacklogTasks}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
