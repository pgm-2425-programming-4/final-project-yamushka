import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

//  api functies
import { fetchTasksByProject } from '../api/task/fetchTasks.js';
import { fetchProjectByDocumentId } from '../api/project/fetchProjectById.js';

// componenten
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';
import Pagination from '../components/Pagination';

// Styling
import '../styles/main.css';
import '../styles/backlog.css';



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

  if (projectLoading || isLoading) return <p>Backlog taken laden...</p>;
  if (error) return <p>Fout bij laden backlog taken</p>;
  if (!project) return <p>Project niet gevonden</p>;

  return (
    <div className="backlog-container">
      <div className="backlog-header">
        <h1>{project?.name || 'Project'}</h1>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          + Add Backlog Task
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

      <div className="backlog-tasks">
        {totalBacklogTasks === 0 && (
          <div className="empty-backlog">
            <h3>Geen backlog taken gevonden</h3>
            <p>Er zijn momenteel geen taken met de status "Backlog" voor dit project.</p>
            <p>Gebruik de "Add Backlog Task" knop om een nieuwe taak toe te voegen.</p>
          </div>
        )}
        {currentItems.map(task => (
          <div key={task.id} className="backlog-task-card" onClick={() => setSelectedTask(task)}>
            <h4>{task.taskTitle}</h4>
            <p>
              {!task.taskDescription
                ? 'Geen beschrijving'
                : typeof task.taskDescription === 'string'
                  ? task.taskDescription
                  : 'Klik om beschrijving te bekijken'}
            </p>
            <div className="task-meta">
              <p>
                <span className="task-meta-label">Task ID:</span> {task.id}
              </p>
              <p>
                <span className="task-meta-label">Project:</span>{' '}
                {task.project ? `${task.project.name} (ID: ${task.project.id})` : 'Geen project'}
              </p>
              <p>
                <span className="task-meta-label">Status:</span>{' '}
                {task.taskStatus
                  ? `${task.taskStatus.statusName} (ID: ${task.taskStatus.id})`
                  : 'Geen status'}
              </p>
            </div>
          </div>
        ))}

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
